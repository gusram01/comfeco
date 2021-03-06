import { Injectable } from '@angular/core';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class SaveLocalService {
  setItem(key: string, item: any) {
    return localForage
      .setItem(key, item)
      .then((val) => val)
      .catch((err) => err);
  }

  getItem(key: string): Promise<string> {
    return localForage
      .getItem<string>(key)
      .then((val) => val)
      .catch((err) => err);
  }

  removeItem(key: string) {
    return localForage
      .removeItem(key)
      .then((val) => val)
      .catch((err) => err);
  }
}
