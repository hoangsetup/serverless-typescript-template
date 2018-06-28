import {IsInt, Length, Min} from 'class-validator';

export class CreateMovieDto {

  @Length(5, 50)
  public title: string;

  @IsInt()
  @Min(1970)
  public year: number;
}
