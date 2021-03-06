import { useQuery } from 'react-query';
import ArticleAPI from '../../../api/article';
import { QUERY_KEYS } from '../../../config/queryKeys';

const useGetAllArticle = (cursor?: number) => {
  return useQuery([QUERY_KEYS.ARTICLE], () => ArticleAPI.getAll(cursor));
};

export default useGetAllArticle;
