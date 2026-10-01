import { Component, OnDestroy, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';

@Component({
  selector: 'app-landing-page',
  imports: [...SHARED_IMPORTS],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  standalone: true,
})
export class LandingPage implements OnInit, OnDestroy {
  // Lista de imagenes

  carouselImages : string[] = [
    'assets/images/coo4.jpg',
    'assets/images/biblioteca.jpg',
    'assets/images/fuente.jpg'
  ];

  currentIndex: number = 0;
  private intervalId: any;

  ngOnInit(){
    this.intervalId = setInterval( () => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy(){
    if(this.intervalId)
    {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(){
    this.currentIndex =(this.currentIndex + 1) % this.carouselImages.length;
  }

  setSlide(index: number)
  {
    this.currentIndex = index;
  }
}
