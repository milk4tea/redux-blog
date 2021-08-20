import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

import { 
    selectAllPosts, 
    fetchPosts,
    selectPostIds,
    selectPostById
} from './postsSlice'

let PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article className="post-excerpt" key={postId}>
            <h3>{post.title}</h3>
            <PostAuthor userId={post.user} />
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post} />
            <Link to={`/posts/${postId}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
    const dispatch = useDispatch()
    const orderedPostIds = useSelector(selectPostIds)
    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content
    if(postStatus === 'loading') {
        content = <div className="loader">Loading</div>
    } else if(postStatus === 'succeeded') {        
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))    
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }


    return (
        <section className="post-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}