import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.page.html',
  styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit {
  likedPaintings: any[] = [];

  constructor(
    private navCtrl: NavController,
    private storage: Storage
  ) {}
 //use Angular's IonViewWillEnter lifecycle hook. This hook will trigger when the page is about to enter and become active, 
 //ensuring that the latest data is loaded.s
  async ngOnInit() {
    await this.storage.create();
    this.loadLikedPaintings();
  }

  ionViewWillEnter() {
    this.loadLikedPaintings();
  }

  async loadLikedPaintings() {
    this.likedPaintings = await this.storage.get('likedPaintings') || [];
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
    this.loadLikedPaintings(); // Refresh the liked paintings list
  }
}