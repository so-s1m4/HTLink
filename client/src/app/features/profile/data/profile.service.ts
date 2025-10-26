import { Injectable } from '@angular/core';
import { Profile as ProfileType } from "@core/eviroments/config.constants"


@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  async getProfileById(_id: string): Promise<ProfileType> {
    throw new Error('Method not implemented.');
  }
}
