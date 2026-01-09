import PostForm from '../PostForm';
import { createPostAction } from '@/app/actions/posts';

export default function PostCreateForm() {
  return <PostForm action={createPostAction} />;
}
