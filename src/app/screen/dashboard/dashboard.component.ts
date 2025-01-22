import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Component/Home/header/header.component';
import { FooterComponent } from '../../Component/Home/footer/footer.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/authService';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  dashboardData: any = {
    booksListed: 0,
    booksSold: 0,
    earnings: 0,
    recentActivity: [],
  };

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        console.log('Token is valid', response);
        this.authService.getDashboardData().subscribe((data) => {
          console.log(data);
          this.dashboardData = data;
        });
      },
      error: (err) => {
        console.error('Token validation failed', err);
        this.router.navigate(['/login']);
      },
    });
  }

  downloadSalesReport() {
    this.authService.generateSaleReport().subscribe(
      (pdfData: Blob) => {
        saveAs(pdfData, 'sales-report.pdf');
      },
      (error) => {
        console.error('Error downloading sales report', error);
      }
    );
  }
}
