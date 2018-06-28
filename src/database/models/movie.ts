export interface Info {
  directors?: string[];
  releaseDate?: string;
  rating?: number;
  genres?: string[];
  imageUrl?: string;
  plot?: string;
  rank?: number;
  running_time_secs: number;
  actors?: string[];
}

export interface IMovie {
  title: string;
  year: number;
  info?: Info;
}
