import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';

// Import from the legacy build (v4)
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

// IMPORTANT: Set the workerSrc to your public URL.
// Since Angular 19 uses a public folder instead of assets, ensure you've placed
// the file "pdf.worker.min.mjs" in your public folder.
// The URL should be accessible via http://localhost:4200/pdf.worker.min.mjs.
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

@Component({
  selector: 'app-read-book',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.css'],
})
export class ReadBookComponent implements OnInit {
  bookId: string = '';
  book: any = null;
  pdfLink: string = '';
  pdfDoc: any = null;
  currentPage: number = 1; // Left page number (pages displayed in pairs)
  totalPages: number = 0;
  isFlipping: boolean = false;
  isRightFlippingNext: boolean = false;
  isLeftFlippingPrev: boolean = false;

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
    // Validate token
    this.authService.validateToken().subscribe({
      next: (response) => console.log('Token is valid', response),
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });

    // Get book id from the route
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bookId) {
      this.getBookDetails(this.bookId);
    }
  }

  getBookDetails(id: string) {
    this.authService.getBook(id).subscribe(
      (data: any) => {
        this.book = data;
        if (this.book && this.book.pdfLink) {
          this.pdfLink = this.book.pdfLink;
          this.loadPdf();
        }
      },
      (error) => console.error('Failed to fetch book details', error)
    );
  }

  async loadPdf() {
    try {
      const loadingTask = getDocument({ url: this.pdfLink });
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.renderCurrentPages();
    } catch (error) {
      console.error('Error loading PDF: ', error);
    }
  }

  async renderCurrentPages() {
    // Render left page (currentPage)
    await this.renderPage(this.currentPage, this.leftCanvasRef);
    // Render right page (currentPage + 1) if available
    if (this.currentPage + 1 <= this.totalPages) {
      await this.renderPage(this.currentPage + 1, this.rightCanvasRef);
    } else if (this.rightCanvasRef) {
      const ctx = this.rightCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          this.rightCanvasRef.nativeElement.width,
          this.rightCanvasRef.nativeElement.height
        );
      }
    }
  }

  async renderPage(
    pageNumber: number,
    canvasRef: ElementRef<HTMLCanvasElement>
  ) {
    const page = await this.pdfDoc.getPage(pageNumber);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = { canvasContext: context!, viewport: viewport };
    await page.render(renderContext).promise;
  }

  // nextPages() {
  //   if (this.currentPage + 1 < this.totalPages) {
  //     this.isRightFlippingNext = true;
  //     setTimeout(() => {
  //       // When flipping next, the right page becomes the new left page.
  //       this.currentPage += 1;
  //       this.renderCurrentPages();
  //       this.isRightFlippingNext = false;
  //     }, 800); // Duration matches CSS animation duration
  //   }
  // }

  // // For Previous: animate the left page flipping (backward) and then update currentPage.
  // prevPages() {
  //   if (this.currentPage > 1) {
  //     this.isLeftFlippingPrev = true;
  //     setTimeout(() => {
  //       // When flipping previous, the left page becomes the new right page.
  //       this.currentPage -= 1;
  //       this.renderCurrentPages();
  //       this.isLeftFlippingPrev = false;
  //     }, 800);
  //   }
  // }

  nextPages() {
    if (this.currentPage + 1 < this.totalPages) {
      this.isRightFlippingNext = true;
      setTimeout(() => {
        // After the flip, update the current page pointer.
        this.currentPage += 1;
        this.renderCurrentPages();
        this.isRightFlippingNext = false;
      }, 800); // Duration should match the animation duration.
    }
  }

  // For Previous: animate the left page with advanced flip and then update currentPage.
  prevPages() {
    if (this.currentPage > 1) {
      this.isLeftFlippingPrev = true;
      setTimeout(() => {
        this.currentPage -= 1;
        this.renderCurrentPages();
        this.isLeftFlippingPrev = false;
      }, 800);
    }
  }

  flipPages(callback: () => void) {
    this.isFlipping = true;
    setTimeout(() => {
      callback();
      this.isFlipping = false;
    }, 800);
  }
}
