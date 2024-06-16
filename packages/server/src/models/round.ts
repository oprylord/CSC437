export interface Round {
    Winner: string | undefined ;
    RoundWinnings : {[key:string]: number};
    Scores: {[key:string]: number};
      
}