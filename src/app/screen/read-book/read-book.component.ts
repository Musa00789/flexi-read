import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';
import { LoaderComponent } from '../Extra-Screens/loader/loader.component';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

@Component({
  selector: 'app-read-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
  ],
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.css'],
})
export class ReadBookComponent implements OnInit {
  bookId = '';
  book: any = null;
  pdfLink = '';
  pdfDoc: any = null;
  currentPage = 1;
  totalPages = 0;
  loading = false;

  isRightFlippingNext = false;
  isLeftFlippingPrev = false;

  selectedPage = 1;
  pageToRead: number | null = null;
  isReading = false;

  selectedSentence: string | null = null;

  summaryText: string | null = null;
  showSummary = false;

  @ViewChild('leftCanvas', { static: false })
  leftCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightCanvas', { static: false })
  rightCanvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe({
      next: () => {},
      error: () => this.router.navigate(['/login']),
    });
    this.loading = true;
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookId) this.getBookDetails(this.bookId);
  }

  getBookDetails(id: string) {
    this.authService.getBook(id).subscribe(
      (data) => {
        this.book = data;
        if (this.book?.pdfLink) {
          this.pdfLink = this.book.pdfLink;
          this.loadPdf();
        }
      },
      (err) => {
        console.error('Failed to fetch book details', err);
        this.loading = false;
      }
    );
  }

  async loadPdf() {
    try {
      const task = getDocument({ url: this.pdfLink });
      this.pdfDoc = await task.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.renderCurrentPages();
    } catch (err) {
      console.error('Error loading PDF:', err);
    } finally {
      this.loading = false;
    }
  }

  async renderCurrentPages() {
    await this.renderPage(this.currentPage, this.leftCanvasRef);
    if (this.currentPage + 1 <= this.totalPages) {
      await this.renderPage(this.currentPage + 1, this.rightCanvasRef);
    } else {
      const ctx = this.rightCanvasRef.nativeElement.getContext('2d');
      ctx?.clearRect(
        0,
        0,
        this.rightCanvasRef.nativeElement.width,
        this.rightCanvasRef.nativeElement.height
      );
    }
  }

  async renderPage(pageNum: number, canvasRef: ElementRef<HTMLCanvasElement>) {
    const page = await this.pdfDoc.getPage(pageNum);
    const scale = 1.5;
    const vp = page.getViewport({ scale });
    const canvas = canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = vp.width;
    canvas.height = vp.height;
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
  }

  nextPages() {
    if (this.currentPage + 1 < this.totalPages) {
      this.isRightFlippingNext = true;
      speechSynthesis.cancel();
      this.isReading = false;
      setTimeout(() => {
        this.currentPage++;
        this.renderCurrentPages();
        this.isRightFlippingNext = false;
      }, 800);
    }
  }

  prevPages() {
    if (this.currentPage > 1) {
      this.isLeftFlippingPrev = true;
      speechSynthesis.cancel();
      this.isReading = false;
      setTimeout(() => {
        this.currentPage--;
        this.renderCurrentPages();
        this.isLeftFlippingPrev = false;
      }, 800);
    }
  }

  selectPage(pageNum: number) {
    this.selectedPage = pageNum;
  }

  toggleRead() {
    if (this.isReading) {
      this.isReading = false;
      speechSynthesis.cancel();
    } else {
      const validPage =
        this.selectedPage >= 1 && this.selectedPage <= this.totalPages
          ? this.selectedPage
          : this.currentPage;
      this.readPagesAloud(validPage);
    }
  }

  private readPagesAloud(startPage: number) {
    this.pageToRead = startPage;
    this.isReading = true;

    // const speakNext = async () => {
    //   if (!this.isReading || this.pageToRead! > this.totalPages) {
    //     this.isReading = false;
    //     return;
    //   }

    //   const current = this.pageToRead!;

    //   if (current < this.currentPage || current > this.currentPage + 1) {
    //     this.currentPage = current % 2 === 0 ? current - 1 : current;
    //     await this.renderCurrentPages();
    //   }

    //   const text = await this.extractTextFromPage(current);
    //   const utter = new SpeechSynthesisUtterance(text);
    //   utter.lang = 'en-US';

    //   utter.onend = () => {
    //     if (!this.isReading) return;
    //     this.pageToRead!++;
    //     speakNext();
    //   };

    //   utter.onerror = (err) => {
    //     console.error('SpeechSynthesis error:', err);
    //     this.isReading = false;
    //   };

    //   speechSynthesis.speak(utter);
    // };

    const speakNext = async () => {
      if (!this.isReading || this.pageToRead! > this.totalPages) {
        this.isReading = false;
        return;
      }

      const current = this.pageToRead!;

      // Auto-flip pages if needed
      if (current < this.currentPage || current > this.currentPage + 1) {
        this.currentPage = current % 2 === 0 ? current - 1 : current;
        await this.renderCurrentPages();

        // Smooth page flip animation
        if (current > this.currentPage + 1) {
          this.isRightFlippingNext = true;
          setTimeout(() => (this.isRightFlippingNext = false), 800);
        } else if (current < this.currentPage) {
          this.isLeftFlippingPrev = true;
          setTimeout(() => (this.isLeftFlippingPrev = false), 800);
        }
      }

      const text = await this.extractTextFromPage(current);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';

      utter.onend = () => {
        if (!this.isReading) return;
        this.pageToRead!++;
        speakNext();
      };

      utter.onerror = (err) => {
        console.error('SpeechSynthesis error:', err);
        this.isReading = false;
      };

      speechSynthesis.speak(utter);
    };

    speechSynthesis.cancel();
    speakNext();
  }

  private async extractTextFromPage(pageNumber: number): Promise<string> {
    const page = await this.pdfDoc.getPage(pageNumber);
    const content = await page.getTextContent();
    return content.items.map((item: any) => item.str).join(' ');
  }

  summarizeCurrentPage() {
    this.extractTextFromPage(this.currentPage).then((text) => {
      this.authService.getSummary(text).subscribe((summary) => {
        // this.readAloud(summary.summary);
        this.summaryText = summary.summary;
        this.showSummary = true;
      });
    });
  }

  expandSentence(sentence: string) {
    console.log(sentence);
  }
}
