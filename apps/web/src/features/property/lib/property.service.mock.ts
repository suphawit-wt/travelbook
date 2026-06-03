// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyServiceInterface } from './property.service.interface';
import type {
  DestinationTrip,
  EasyTripPlanner,
  PropertyType,
  TrendingDestination,
  TripArticle,
} from './property.service.types';

export class PropertyServiceMock implements PropertyServiceInterface {
  async getPropertyTypes(): Promise<PropertyType[]> {
    const data: PropertyType[] = [
      {
        id: 'hotels',
        title: 'hotel',
        image: '/assets/images/property/hotels.jpeg',
        link: 'hotels',
      },
      {
        id: 'apartments',
        title: 'apartment',
        image: '/assets/images/property/apartments.jpeg',
        link: 'apartments',
      },
      {
        id: 'resorts',
        title: 'resort',
        image: '/assets/images/property/resorts.jpeg',
        link: 'resorts',
      },
      {
        id: 'villas',
        title: 'villa',
        image: '/assets/images/property/villas.jpeg',
        link: 'villas',
      },
      {
        id: 'cabins',
        title: 'cabin',
        image: '/assets/images/property/cabins.jpeg',
        link: 'cabins',
      },
    ];

    return Promise.resolve(data);
  }

  async getTrendingDestinations(): Promise<TrendingDestination[]> {
    const data: TrendingDestination[] = [
      {
        id: 'bangkok',
        name: 'Bangkok',
        image: '/assets/images/destinations/bangkok.jpg',
        country: '🇹🇭',
      },
      {
        id: 'chiang-mai',
        name: 'Chiang Mai',
        image: '/assets/images/destinations/chiang_mai.jpg',
        country: '🇹🇭',
      },
      {
        id: 'tokyo',
        name: 'Tokyo',
        image: '/assets/images/destinations/tokyo.jpg',
        country: '🇯🇵',
      },
      {
        id: 'osaka',
        name: 'Osaka',
        image: '/assets/images/destinations/osaka.jpg',
        country: '🇯🇵',
      },
      {
        id: 'pattaya',
        name: 'Pattaya',
        image: '/assets/images/destinations/pattaya.jpg',
        country: '🇹🇭',
      },
    ];

    return Promise.resolve(data);
  }

  async getEasyTripPlans(): Promise<EasyTripPlanner> {
    const beachList: DestinationTrip[] = [
      {
        id: 'beach-01',
        name: 'Si Racha',
        distance: 13,
        image: '/assets/images/destinations/si_racha.jpg',
        link: 'search?destination=si-racha',
      },
      {
        id: 'beach-02',
        name: 'Jomtien Beach',
        distance: 19,
        image: '/assets/images/destinations/jomtien_beach.jpg',
        link: 'search?destination=jomtien-beach',
      },
      {
        id: 'beach-03',
        name: 'Ko Larn',
        distance: 22,
        image: '/assets/images/destinations/ko_larn.jpg',
        link: 'search?destination=ko-larn',
      },
      {
        id: 'beach-04',
        name: 'Bangsaen',
        distance: 26,
        image: '/assets/images/destinations/bangsaen.jpg',
        link: 'search?destination=bangsaen',
      },
      {
        id: 'beach-05',
        name: 'Bang Sare',
        distance: 32,
        image: '/assets/images/destinations/bang_sare.jpg',
        link: 'search?destination=bang-sare',
      },
      {
        id: 'beach-06',
        name: 'Chon Buri',
        distance: 36,
        image: '/assets/images/destinations/chonburi.jpg',
        link: 'search?destination=chonburi',
      },
      {
        id: 'beach-07',
        name: 'Rayong',
        distance: 55,
        image: '/assets/images/destinations/rayong.jpg',
        link: 'search?destination=rayong',
      },
      {
        id: 'beach-08',
        name: 'Ko Samed',
        distance: 78,
        image: '/assets/images/destinations/ko_samed.jpg',
        link: 'search?destination=ko-samed',
      },
      {
        id: 'beach-09',
        name: 'Hua Hin',
        distance: 119,
        image: '/assets/images/destinations/hua_hin.jpg',
        link: 'search?destination=hua-hin',
      },
      {
        id: 'beach-10',
        name: 'Chanthaburi',
        distance: 137,
        image: '/assets/images/destinations/chanthaburi.jpg',
        link: 'search?destination=chanthaburi',
      },
      {
        id: 'beach-11',
        name: 'Ko Chang',
        distance: 188,
        image: '/assets/images/destinations/ko_chang.jpg',
        link: 'search?destination=ko-chang',
      },
      {
        id: 'beach-12',
        name: 'Ko Kood',
        distance: 236,
        image: '/assets/images/destinations/ko_kood.jpg',
        link: 'search?destination=ko-kood',
      },
    ];

    const romanceList: DestinationTrip[] = [
      {
        id: 'romance-01',
        name: 'Ban Chang',
        distance: 39,
        image: '/assets/images/destinations/ban_chang.jpg',
        link: 'search?destination=ban-chang',
      },
      {
        id: 'romance-02',
        name: 'Sattahip',
        distance: 42,
        image: '/assets/images/destinations/sattahip.jpg',
        link: 'search?destination=sattahip',
      },
      {
        id: 'romance-03',
        name: 'Lat Krabang',
        distance: 76,
        image: '/assets/images/destinations/lat_krabang.jpg',
        link: 'search?destination=lat-krabang',
      },
      {
        id: 'romance-04',
        name: 'Klaeng',
        distance: 77,
        image: '/assets/images/destinations/klaeng.jpg',
        link: 'search?destination=klaeng',
      },
      {
        id: 'romance-05',
        name: 'Haad Chao Samran',
        distance: 94,
        image: '/assets/images/destinations/haad_chao_samran.jpg',
        link: 'search?destination=haad-chao-samran',
      },
      {
        id: 'romance-06',
        name: 'Nonthaburi',
        distance: 101,
        image: '/assets/images/destinations/nonthaburi.jpg',
        link: 'search?destination=nonthaburi',
      },
      {
        id: 'romance-07',
        name: 'Phetchaburi',
        distance: 107,
        image: '/assets/images/destinations/phetchaburi.jpg',
        link: 'search?destination=phetchaburi',
      },
      {
        id: 'romance-08',
        name: 'Amphawa',
        distance: 114,
        image: '/assets/images/destinations/amphawa.jpg',
        link: 'search?destination=amphawa',
      },
      {
        id: 'romance-09',
        name: 'Khao Tao',
        distance: 123,
        image: '/assets/images/destinations/khao_tao.jpg',
        link: 'search?destination=khao-tao',
      },
      {
        id: 'romance-10',
        name: 'Ratchaburi',
        distance: 133,
        image: '/assets/images/destinations/ratchaburi.jpg',
        link: 'search?destination=ratchaburi',
      },
      {
        id: 'romance-11',
        name: 'Trat',
        distance: 193,
        image: '/assets/images/destinations/trat.jpg',
        link: 'search?destination=trat',
      },
      {
        id: 'romance-12',
        name: 'Ban Krut',
        distance: 241,
        image: '/assets/images/destinations/ban_krut.jpg',
        link: 'search?destination=ban-krut',
      },
    ];

    const outdoorsList: DestinationTrip[] = [
      {
        id: 'outdoors-01',
        name: 'Ko Si Chang',
        distance: 18,
        image: '/assets/images/destinations/ko_si_chang.jpg',
        link: 'search?destination=ban-chang',
      },
      {
        id: 'outdoors-02',
        name: 'Nakhon Nayok',
        distance: 132,
        image: '/assets/images/destinations/nakhon_nayok.jpg',
        link: 'search?destination=sattahip',
      },
      {
        id: 'outdoors-03',
        name: 'Sam Roi Yot',
        distance: 139,
        image: '/assets/images/destinations/sam_roi_yot.jpg',
        link: 'search?destination=lat-krabang',
      },
      {
        id: 'outdoors-04',
        name: 'Kaeng Krachan',
        distance: 142,
        image: '/assets/images/destinations/kaeng_krachan.jpg',
        link: 'search?destination=klaeng',
      },
      {
        id: 'outdoors-05',
        name: 'Ban Huai Sok Noi',
        distance: 170,
        image: '/assets/images/destinations/ban_huai_sok_noi.jpg',
        link: 'search?destination=haad-chao-samran',
      },
      {
        id: 'outdoors-06',
        name: 'Suan Phung',
        distance: 181,
        image: '/assets/images/destinations/suan_phung.jpg',
        link: 'search?destination=nonthaburi',
      },
      {
        id: 'outdoors-07',
        name: 'Kanchanaburi',
        distance: 186,
        image: '/assets/images/destinations/kanchanaburi.jpg',
        link: 'search?destination=phetchaburi',
      },
      {
        id: 'outdoors-08',
        name: 'Pak Chong',
        distance: 192,
        image: '/assets/images/destinations/pak_chong.jpg',
        link: 'search?destination=amphawa',
      },
      {
        id: 'outdoors-09',
        name: 'Ko Mak',
        distance: 217,
        image: '/assets/images/destinations/ko_mak.jpg',
        link: 'search?destination=khao-tao',
      },
      {
        id: 'outdoors-10',
        name: 'Sai Yok',
        distance: 242,
        image: '/assets/images/destinations/sai_yok.jpg',
        link: 'search?destination=ratchaburi',
      },
      {
        id: 'outdoors-11',
        name: 'Phetchabun',
        distance: 375,
        image: '/assets/images/destinations/phetchabun.jpg',
        link: 'search?destination=trat',
      },
      {
        id: 'outdoors-12',
        name: 'Khao Kho',
        distance: 400,
        image: '/assets/images/destinations/khao_kho.jpg',
        link: 'search?destination=ban-krut',
      },
    ];

    const cityList: DestinationTrip[] = [
      {
        id: 'city-01',
        name: 'Pattaya',
        distance: 14,
        image: '/assets/images/destinations/pattaya.jpg',
        link: 'search?destination=ban-chang',
      },
      {
        id: 'city-02',
        name: 'Chachoengsao',
        distance: 72,
        image: '/assets/images/destinations/chachoengsao.jpg',
        link: 'search?destination=sattahip',
      },
      {
        id: 'city-03',
        name: 'Bangna',
        distance: 76,
        image: '/assets/images/destinations/bangna.jpg',
        link: 'search?destination=lat-krabang',
      },
      {
        id: 'city-04',
        name: 'Bangkok',
        distance: 91,
        image: '/assets/images/destinations/bangkok_02.jpg',
        link: 'search?destination=klaeng',
      },
      {
        id: 'city-05',
        name: 'Ban Talat Rangsit',
        distance: 109,
        image: '/assets/images/destinations/ban_talat_rangsit.jpg',
        link: 'search?destination=haad-chao-samran',
      },
      {
        id: 'city-06',
        name: 'Nakhon Pathom',
        distance: 128,
        image: '/assets/images/destinations/nakhon_pathom.jpg',
        link: 'search?destination=nonthaburi',
      },
      {
        id: 'city-07',
        name: 'Phra Nakhon Si Ayutthaya',
        distance: 150,
        image: '/assets/images/destinations/phra_nakhon_si_ayutthaya.jpg',
        link: 'search?destination=phetchaburi',
      },
      {
        id: 'city-08',
        name: 'Kamphaeng Phet',
        distance: 410,
        image: '/assets/images/destinations/kam_phaengphet.jpg',
        link: 'search?destination=amphawa',
      },
      {
        id: 'city-09',
        name: 'Phitsanulok',
        distance: 425,
        image: '/assets/images/destinations/phitsanulok.jpg',
        link: 'search?destination=khao-tao',
      },
      {
        id: 'city-10',
        name: 'Sukhothai',
        distance: 457,
        image: '/assets/images/destinations/sukhothai.jpg',
        link: 'search?destination=ratchaburi',
      },
      {
        id: 'city-11',
        name: 'Mueang Kao',
        distance: 462,
        image: '/assets/images/destinations/mueang_kao.jpg',
        link: 'search?destination=trat',
      },
      {
        id: 'city-12',
        name: 'Uttaradit',
        distance: 517,
        image: '/assets/images/destinations/uttaradit.jpg',
        link: 'search?destination=ban-krut',
      },
    ];

    const relaxList: DestinationTrip[] = [
      {
        id: 'relax-01',
        name: 'Ban Phe',
        distance: 72,
        image: '/assets/images/destinations/ban_phe.jpg',
        link: 'search?destination=ban-chang',
      },
      {
        id: 'relax-02',
        name: 'Samut Songkhram',
        distance: 109,
        image: '/assets/images/destinations/samut_songkhram.jpg',
        link: 'search?destination=sattahip',
      },
      {
        id: 'relax-03',
        name: 'Pran Buri',
        distance: 134,
        image: '/assets/images/destinations/pran_buri.jpg',
        link: 'search?destination=lat-krabang',
      },
      {
        id: 'relax-04',
        name: 'Choeng Mon Beach',
        distance: 398,
        image: '/assets/images/destinations/choeng_mon_beach.jpg',
        link: 'search?destination=klaeng',
      },
      {
        id: 'relax-05',
        name: 'Ban Bang Po',
        distance: 402,
        image: '/assets/images/destinations/ban_bang_po.jpg',
        link: 'search?destination=haad-chao-samran',
      },
      {
        id: 'relax-06',
        name: 'Nong Khai',
        distance: 571,
        image: '/assets/images/destinations/nong_khai.jpg',
        link: 'search?destination=nonthaburi',
      },
      {
        id: 'relax-07',
        name: 'Klong Muang Beach',
        distance: 604,
        image: '/assets/images/destinations/klong_muang_beach.jpg',
        link: 'search?destination=phetchaburi',
      },
      {
        id: 'relax-08',
        name: 'Ko Mook',
        distance: 656,
        image: '/assets/images/destinations/ko_mook.jpg',
        link: 'search?destination=amphawa',
      },
      {
        id: 'relax-09',
        name: 'Phayao',
        distance: 689,
        image: '/assets/images/destinations/phayao.jpg',
        link: 'search?destination=khao-tao',
      },
    ];

    const data: EasyTripPlanner = {
      beachList,
      relaxList,
      romanceList,
      cityList,
      outdoorsList,
    };

    return Promise.resolve(data);
  }

  async getInspirationArticles(): Promise<TripArticle[]> {
    const data: TripArticle[] = [
      {
        id: 'best-hotels-los-angeles',
        title: '5 of the best hotels in Los Angeles',
        description:
          'From Hollywood to Beverly Hills discover 5 of the best hotels in Los Angeles for your stay',
        image: '/assets/images/articles/article_01.webp',
        link: 'articles/best-hotels-los-angeles',
      },
      {
        id: 'best-orlando-hotels-families',
        title: 'The 6 best Orlando hotels for families',
        description:
          'Discover the best Orlando hotels for families for your vacation.',
        image: '/assets/images/articles/article_02.webp',
        link: 'articles/best-orlando-hotels-families',
      },
      {
        id: 'best-ski-towns',
        title: '5 best ski towns around the world',
        description:
          'Discover a winter wonderland in these charming ski destinations',
        image: '/assets/images/articles/article_03.webp',
        link: 'articles/best-ski-towns',
      },
      {
        id: 'usa-thanksgiving-holiday-homes',
        title: '5 vacation homes for a Thanksgiving getaway',
        description: 'Enjoy Thanksgiving dinner at these vacation homes.',
        image: '/assets/images/articles/article_04.webp',
        link: 'articles/usa-thanksgiving-holiday-homes',
      },
      {
        id: 'bangkok-rooftop-bars',
        title: '6 incredible Bangkok rooftop bars',
        description: 'Amazing city views, cocktails, and world-class cuisine.',
        image: '/assets/images/articles/article_05.webp',
        link: 'articles/bangkok-rooftop-bars',
      },
    ];

    return Promise.resolve(data);
  }
}
