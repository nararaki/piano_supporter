export const comment = (id,content,userId,videoId,date)=>{
  return {
    id,
    content,
    userId,
    videoId,
    createdAt: date,
  };
}

