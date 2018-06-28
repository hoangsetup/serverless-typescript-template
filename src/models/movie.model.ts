export type Movie = {

   title: string;

   year: number;

   info: Info;
};

export type Info = {

   directors?: string;

   releaseDate?: string;

   rating?: number;

   genres?: string[];

   imageUrl?: string;

   plot?: string;

   rank?: number;

   runningTimeSecs: number;

   actors?: string[];
};
