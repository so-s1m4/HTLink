import {Component, computed, inject, OnInit} from '@angular/core';
import {SearchBar} from "@shared/ui/search-bar/search-bar";
import {MarketplaceService} from "@core/services/marketplace.service";
import {Offer} from "@app/pages/marketplace/children/offer/offer";

@Component({
  selector: 'app-marketplace',
  imports: [
    SearchBar,
    Offer
  ],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css'
})
export class Marketplace implements OnInit {
  marketplaceService = inject(MarketplaceService);
  offers = computed(this.marketplaceService.offers);

  filters: any = [{
    label: 'Category',
    options: [
      {label: 'Web Development', value: 'web-development'},
      {label: 'Data Science', value: 'data-science'},
      {label: 'Mobile Apps', value: 'mobile-apps'},
    ]
  }
  ];


  ngOnInit() {
    this.marketplaceService.fetchOffers(this.filters)
  }
  onSearchSubmit(event: {value: string, filters: {[key: string]: any}}) {
    this.filters = event.filters;
    this.filters['search'] = event.value;
    this.marketplaceService.fetchOffers(this.filters);
  }
}
