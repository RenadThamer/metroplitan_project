import { Component, OnInit } from '@angular/core';
import { MetApiService } from '../services/met-api.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  paintings: any[] = [];
  

  constructor(
    private metApiService: MetApiService,
    private router: Router,
    private navCtrl: NavController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const likedPaintings = await this.storage.get('likedPaintings') || [];

    this.metApiService.searchPaintings('painting').subscribe((response: any) => {
      if (response.objectIDs) {
        response.objectIDs.slice(11,22).forEach((objectID: number) => {
          this.metApiService.getPaintingDetails(objectID).subscribe((details: any) => {
            details.liked = likedPaintings.some((p: any) => p.objectID === details.objectID);
            this.paintings.push(details);
          });
        });
      }
    });
  }

  goToDetailsPage(id: number) {
    this.navCtrl.navigateForward(`/details/${id}`);
  }

  async likePainting(painting: any) {
    let likedPaintings = await this.storage.get('likedPaintings') || [];
    const index = likedPaintings.findIndex((p: any) => p.objectID === painting.objectID);
    if (index === -1) {
      painting.liked = true;
      likedPaintings.push(painting);
    } else {
      painting.liked = false;
      likedPaintings.splice(index, 1);
    }
    await this.storage.set('likedPaintings', likedPaintings);
  }

  goToLikesPage() {
    this.navCtrl.navigateForward('/likes');
  }
}