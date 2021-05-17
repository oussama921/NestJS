// import { Foot } from '../../auth/enum/foot.enum';
// import { Gender } from '../../auth/enum/gender.enum';

export class AddUserDTO {
  
  readonly firstName: string
  readonly email: string
  readonly phone: string
  readonly lastName: string
  readonly birthDate: Date;
  readonly citizenship: string;
  readonly height: string;
  readonly shirtSize: string;
  // readonly gender: Gender;
  // readonly foot: Foot;
  readonly weight: number;
  readonly position: string;
  readonly role: string;

}

// const transformPlayers = players => {
//   if (Array.isArray(players)) {
//     return players.map(player => ({email: player.email}))
//   } else {
//     return tags;
//   }
// }
