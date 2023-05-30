'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useAppDispatch } from '../hooks/redux';
import { setFavoriteGenres } from '../slices/userSlice';
import styles from '../styles/SelectGenres.module.scss';

interface SelectGenresProps {
	genres: {
		title: string;
		instrumentation: string[];
		_id: string;
		createdAt: string;
		updatedAt: string;
	}[];
}

function onDragEnd(result: any, columns: any, setColumns: any) {
	if (!result.destination) return;
	const { source, destination } = result;
	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destinationColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destinationItems = [...destinationColumn.items];
		const [removed] = sourceItems.splice(source.index, 1);
		destinationItems.splice(destination.index, 0, removed);
		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destinationColumn,
				items: destinationItems,
			},
		});
	} else {
		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
	}
}

export default function SelectGenres({ genres }: SelectGenresProps) {
	const [columns, setColumns] = useState({
		['genre']: {
			name: 'Genres',
			items: [...genres],
		},
		['selected']: {
			name: 'Favorite genres',
			items: [],
		},
	});
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setFavoriteGenres({ favoriteGenres: columns.selected.items }));
	}, [columns, dispatch]);

	return (
		<div className={styles.dndContainer}>
			<DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
				{Object.entries(columns).map(([id, column]) => {
					return (
						<div key={id} className={styles.dragDropContainer}>
							<h2>{column.name}</h2>
							<Droppable droppableId={id}>
								{(provided, snapshot) => {
									return (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={{
												background: snapshot.isDraggingOver ? '#ededed' : '#efefef',
												padding: '2rem',
												maxWidth: '400px',
												minHeight: '32rem',
												maxHeight: '32rem',
												overflow: 'auto',
												borderRadius: '1rem',
											}}
											className='draggable'
										>
											{column.items &&
												column.items.map((item, index) => {
													return (
														<Draggable key={item._id} draggableId={item._id} index={index}>
															{(provided, snapshot) => {
																return (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		style={{
																			userSelect: 'none',
																			padding: '1rem',
																			margin: '0 0 2rem 0',
																			minHeight: '3rem',
																			backgroundColor: snapshot.isDragging ? '#499feb' : '#228be6',
																			color: 'white',
																			borderRadius: '1rem',
																			...provided.draggableProps.style,
																		}}
																	>
																		{item.title}
																	</div>
																);
															}}
														</Draggable>
													);
												})}
											{provided.placeholder}
										</div>
									);
								}}
							</Droppable>
						</div>
					);
				})}
			</DragDropContext>
		</div>
	);
}
