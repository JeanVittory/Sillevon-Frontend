'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import ClientLayout from '../../../components/ClientLayout';
import Posts from '../../../components/Posts';
import { Loader as Loading } from '../../../components/Loader';
import { Center, Loader } from '@mantine/core';
import { usePosts } from '../../../hooks/posts';
import { usePostClient, useClientData } from './service/client';
import styles from '../../../styles/Client.module.scss';

interface Posts {
	post: [];
}

export default function Client() {
	const [page, setPage] = useState<number>(1);
	const [postsToRender, setPostsToRender] = useState<any>();
	const { newPosts, isLoading, hasNextPage } = usePosts(page);
	const watcher = useRef<any>(null);
	const { data: user, error: clientDataError, isLoading: isLoadingClientData } = useClientData();
	const { data: posts, error, isLoading: isLoadingUserPosts } = usePostClient();

	useEffect(() => {
		setPostsToRender(posts);
	}, [posts]);

	useEffect(() => {
		if (!(page === 1)) {
			setPostsToRender((prev: any) => [...prev, ...newPosts]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newPosts]);

	const lastPosts = useCallback(
		(post: HTMLDivElement) => {
			if (isLoading) return;
			if (watcher.current) {
				watcher.current.disconnect();
			}

			watcher.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					setPage((prev) => prev + 1);
				}
			});
			if (post && watcher.current) watcher.current.observe(post);
		},
		[isLoading, hasNextPage]
	);

	if (isLoadingUserPosts || isLoadingClientData)
		return (
			<div className={styles.loaderContainer}>
				<Loading />
			</div>
		);
	const posters = postsToRender?.post?.map((post: any, i: number) => {
		if (postsToRender?.post.length === i + 1) {
			return (
				<div ref={lastPosts} key={post._id}>
					<Posts
						user={post.user}
						postId={post._id}
						urlImage={post.urlImage}
						title={post.title}
						likesAmount={post.likes}
						comments={post.comments}
					/>
				</div>
			);
		} else {
			return (
				<div key={post._id}>
					<Posts
						user={post.user}
						postId={post._id}
						urlImage={post.urlImage}
						title={post.title}
						likesAmount={post.likes}
						comments={post.comments}
					/>
				</div>
			);
		}
	});

	return (
		<ClientLayout>
			<div className={styles.clientProfile}>{posters}</div>
			{isLoading && (
				<Center>
					<Loader />
				</Center>
			)}
		</ClientLayout>
	);
}
