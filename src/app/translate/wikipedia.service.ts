import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WikiLanguage} from "./wiki-language";

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  constructor(
    private http: HttpClient
  ) { }

  getAllAvailableLangs(): Observable<WikiLanguage[]> {
    return new Observable(observer => {
      this.http.get('https://commons.wikimedia.org/w/api.php', {
        params: {
          'action': 'sitematrix',
          'smtype': 'language',
          'format': 'json',
          'origin': '*'
        }
      }).subscribe(response => {
        let langs = WikipediaService.getLangsFromResponse(response);
        observer.next(langs);
        observer.complete();
      }, error => {
        console.log("Couldn't get all available languages: ", error);
        observer.error(error);
        observer.complete();
      });
    });
  }

  private static getLangsFromResponse(response: Object) {
    let elements = WikipediaService.getElementsFromObject(response['sitematrix']);
    return elements.map(elem => WikipediaService.mapLang(elem)).filter(lang => lang.url);
  }

  private static mapLang(elem) {
    return {
      code: elem.code,
      name: elem.name,
      localName: elem.localname,
      url: elem['site'] && WikipediaService.findWikipediaOrgSite(elem) ? WikipediaService.findWikipediaOrgSite(elem).url : null
    };
  }

  private static findWikipediaOrgSite(elem) {
    return elem['site'].find(site => site.url.includes('wikipedia.org'));
  }

  private static getElementsFromObject(obj: Object): any[] {
    let elements = [];
    for (let key in obj) {
      elements.push(obj[key]);
    }
    return elements;
  }

  search(url: string, query: string): Observable<any> {
    return new Observable<any>(observer => {
      this.http.get(url + '/w/api.php', {
        params: {
          'origin': '*',
          'action': 'query',
          'list': 'search',
          'srsearch': query,
          // 'srlimit': 20,
          'format': 'json',
        },
      }).subscribe(response => {
        let autocompleteOptions = WikipediaService.getElementsFromObject(response['query']['search']);
        observer.next(autocompleteOptions);
        observer.complete()
      }, error => {
        console.log(error);
        observer.error(error);
        observer.complete();
      });
    });
  }

  getLangLinks(url: string, title: string): Observable<WikiLanguage[]> {
    return new Observable<WikiLanguage[]>(observer => {
      this.http.get(url + '/w/api.php', {
        params: {
          'origin': '*',
          'action': 'query',
          'titles': title,
          'prop': 'langlinks',
          'llprop': 'url|autonym|langname',
          'format': 'json',
          'lllimit': '500',
        },
      }).subscribe(response => {
        let langLinks = this.extractLangLinksFromResponse(response);
        observer.next(langLinks);
        observer.complete();
      }, error => {
        console.log(error);
        observer.error(error);
        observer.complete();
      });
    });
  }

  private extractLangLinksFromResponse(response: Object) {
    let pages = response['query']['pages'];
    let elements = WikipediaService.getElementsFromObject(pages[Object.keys(pages)[0]]['langlinks']);
    return elements.map(elem => WikipediaService.mapLangLink(elem));
  }

  private static mapLangLink(elem) {
    return {
      name: elem['langname'],
      localName: elem['autonym'],
      url: elem['url'],
      code: elem['lang'],
      title: elem['*'],
    }
  }

  getArticle(langCode: string, title: string): Observable<any> {
    return this.http.get(`https://${langCode}.wikipedia.org/w/api.php?`, {
      params: {
        'action': 'parse',
        'section': '0',
        'prop': 'text',
        'page': title,
        'origin': '*',
        'format': 'json'
      }
    });
  }
}
