import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { AuthService } from '../../../Services/authService';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  isLoggedIn: boolean = false;
  user: any;
  constructor(private authService: AuthService, private router: Router) {}

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private bookMeshes: THREE.Mesh[] = [];
  private categories = [
    'Fiction',
    'Sci-Fi',
    'Non-Fiction',
    'History',
    'Fantasy',
  ];

  ngAfterViewInit() {
    this.initScene();
    this.createFloatingBooks();
    this.addWelcomeText();
    this.animate();
  }

  ngOnInit(): void {
    this.authService.validateToken().subscribe(
      (response) => {
        this.isLoggedIn = true;
        this.authService.getUser(response.user.id).subscribe((resp) => {
          this.user = resp.user;
        });
      },
      (error) => {
        console.log('Token valition failed.', error);
      }
    );
  }

  private initScene() {
    const container = this.canvasContainer.nativeElement;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    window.addEventListener('click', (event) => this.onMouseClick(event));
  }

  private createFloatingBooks() {
    const numBooks = 25;
    const screenWidth = window.innerWidth / 100;
    const screenHeight = window.innerHeight / 100;

    for (let i = 0; i < numBooks; i++) {
      const geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      });

      const book = new THREE.Mesh(geometry, material);

      // book.position.set(
      //   (Math.random() * screenWidth - screenWidth / 2) * 10,
      //   (Math.random() * screenHeight - screenHeight / 2) * 5,
      //   Math.random() * -10
      // );

      book.position.set(
        (Math.random() - 0.4) * 20,
        (Math.random() - 0.4) * 8,
        (Math.random() - 0.5) * -5
      );
      book.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      book.userData['category'] = this.categories[i % this.categories.length];

      this.bookMeshes.push(book);
      this.scene.add(book);
    }
  }

  private addWelcomeText() {
    const loader = new FontLoader();
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const textGeometry = new TextGeometry(
          'Welcome to the World of Books where Passion meets Audience.',
          {
            font: font,
            size: 0.5,
            depth: 0.1,
          }
        );
        const textMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-10.5, 5, 0);
        this.scene.add(textMesh);
      }
    );
  }

  private onMouseMove(event: MouseEvent) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.bookMeshes);

    this.bookMeshes.forEach((book) => book.scale.set(1, 1, 1));
    if (intersects.length > 0) {
      intersects[0].object.scale.set(1.2, 1.2, 1.2);
    }
  }

  private onMouseClick(event: MouseEvent) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.bookMeshes);

    if (intersects.length > 0) {
      const clickedBook = intersects[0].object;
      alert(`You clicked on a ${clickedBook.userData['category']} book!`);
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    this.bookMeshes.forEach((book) => {
      book.rotation.x += 0.002;
      book.rotation.y += 0.002;
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
