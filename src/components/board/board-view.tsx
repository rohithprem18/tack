"use client";

import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Logo } from "@/components/logo";
import { ListColumn } from "@/components/board/list-column";
import { AddInline } from "@/components/board/add-inline";
import { CardPanel } from "@/components/board/card-panel";
import { CardPreview } from "@/components/board/card-preview";
import { InvitePopover } from "@/components/board/invite-popover";
import { createCardAction, deleteCardAction, moveCardAction, updateCardAction } from "@/lib/actions/cards";
import { createListAction } from "@/lib/actions/lists";
import type { CardData, ListData, MemberData } from "@/components/board/types";

type OptimisticAction =
  | { type: "move"; cardId: string; toListId: string; position: number }
  | { type: "addCard"; tempId: string; listId: string; title: string }
  | { type: "addList"; tempId: string; title: string }
  | { type: "updateCard"; cardId: string; data: { title?: string; description?: string; assigneeId?: string | null } }
  | { type: "deleteCard"; cardId: string };

function findListIdForCard(lists: ListData[], cardId: string) {
  return lists.find((l) => l.cards.some((c) => c.id === cardId))?.id ?? null;
}

function nextPosition(items: { position: number }[]) {
  return items.length === 0 ? 0 : Math.max(...items.map((i) => i.position)) + 1;
}

function listsReducer(state: ListData[], action: OptimisticAction): ListData[] {
  switch (action.type) {
    case "move": {
      let moved: CardData | undefined;
      const stripped = state.map((list) => {
        const found = list.cards.find((c) => c.id === action.cardId);
        if (!found) return list;
        moved = found;
        return { ...list, cards: list.cards.filter((c) => c.id !== action.cardId) };
      });
      if (!moved) return state;
      return stripped.map((list) =>
        list.id === action.toListId
          ? { ...list, cards: [...list.cards, { ...moved!, listId: action.toListId, position: action.position }] }
          : list
      );
    }
    case "addCard": {
      return state.map((list) =>
        list.id === action.listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: action.tempId,
                  title: action.title,
                  description: null,
                  position: nextPosition(list.cards),
                  listId: action.listId,
                  assigneeId: null,
                },
              ],
            }
          : list
      );
    }
    case "addList": {
      return [
        ...state,
        { id: action.tempId, title: action.title, position: nextPosition(state), cards: [] },
      ];
    }
    case "updateCard": {
      return state.map((list) => ({
        ...list,
        cards: list.cards.map((c) =>
          c.id === action.cardId
            ? {
                ...c,
                ...(action.data.title !== undefined ? { title: action.data.title } : {}),
                ...(action.data.description !== undefined ? { description: action.data.description } : {}),
                ...(action.data.assigneeId !== undefined ? { assigneeId: action.data.assigneeId } : {}),
              }
            : c
        ),
      }));
    }
    case "deleteCard": {
      return state.map((list) => ({
        ...list,
        cards: list.cards.filter((c) => c.id !== action.cardId),
      }));
    }
    default:
      return state;
  }
}

export function BoardView({
  boardId,
  boardTitle,
  lists,
  members,
}: {
  boardId: string;
  boardTitle: string;
  lists: ListData[];
  members: MemberData[];
}) {
  const router = useRouter();
  const [optimisticLists, applyOptimistic] = useOptimistic(lists, listsReducer);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const membersById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  // Poll for other members' changes instead of requiring a hard refresh.
  // Skipped mid-drag, mid-mutation, or while the tab is in the background —
  // a refresh landing during any of those would yank state out from under
  // dnd-kit or clobber an in-flight optimistic update.
  const skipRef = useRef(false);
  useEffect(() => {
    skipRef.current = activeCard !== null || isPending;
  }, [activeCard, isPending]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && !skipRef.current) {
        router.refresh();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const selectedCard = selectedCardId
    ? optimisticLists.flatMap((l) => l.cards).find((c) => c.id === selectedCardId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    const card = optimisticLists.flatMap((l) => l.cards).find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const cardId = String(active.id);
    const sourceListId = findListIdForCard(optimisticLists, cardId);
    if (!sourceListId) return;

    const overIsList = optimisticLists.some((l) => l.id === over.id);
    const targetListId = overIsList ? String(over.id) : findListIdForCard(optimisticLists, String(over.id));
    if (!targetListId) return;

    const overCardId = overIsList ? null : String(over.id);
    const targetList = optimisticLists.find((l) => l.id === targetListId)!;
    const siblings = targetList.cards
      .filter((c) => c.id !== cardId)
      .sort((a, b) => a.position - b.position);

    const insertIndex = overCardId ? siblings.findIndex((c) => c.id === overCardId) : siblings.length;
    const prev = siblings[insertIndex - 1]?.position;
    const next = siblings[insertIndex]?.position;
    const position =
      prev === undefined && next === undefined
        ? 0
        : prev === undefined
          ? next! - 1
          : next === undefined
            ? prev + 1
            : (prev + next) / 2;

    if (targetListId === sourceListId && overCardId === cardId) return;

    startTransition(() => {
      applyOptimistic({ type: "move", cardId, toListId: targetListId, position });
    });
    moveCardAction(cardId, targetListId, position).catch(() => router.refresh());
  }

  function handleAddCard(listId: string, title: string) {
    const tempId = `temp-${crypto.randomUUID()}`;
    startTransition(() => {
      applyOptimistic({ type: "addCard", tempId, listId, title });
    });
    createCardAction(listId, title).catch(() => router.refresh());
  }

  function handleAddList(title: string) {
    const tempId = `temp-${crypto.randomUUID()}`;
    startTransition(() => {
      applyOptimistic({ type: "addList", tempId, title });
    });
    createListAction(boardId, title).catch(() => router.refresh());
  }

  function handleSaveCard(cardId: string, data: { title?: string; description?: string; assigneeId?: string | null }) {
    startTransition(() => {
      applyOptimistic({ type: "updateCard", cardId, data });
    });
    updateCardAction(cardId, data).catch(() => router.refresh());
  }

  function handleDeleteCard(cardId: string) {
    setSelectedCardId(null);
    startTransition(() => {
      applyOptimistic({ type: "deleteCard", cardId });
    });
    deleteCardAction(cardId).catch(() => router.refresh());
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-rule px-6 py-4 md:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <Logo className="shrink-0" />
          <span className="shrink-0 text-rule">/</span>
          <h1 className="truncate text-sm font-medium text-ink">{boardTitle}</h1>
        </div>
        <div className="shrink-0">
          <InvitePopover boardId={boardId} members={members} />
        </div>
      </header>

      <main className="flex-1 overflow-x-auto px-6 py-6 md:px-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4">
            {optimisticLists.length === 0 ? (
              <p className="text-sm text-muted">No lists yet. Add one to start.</p>
            ) : (
              optimisticLists
                .sort((a, b) => a.position - b.position)
                .map((list) => (
                  <ListColumn
                    key={list.id}
                    list={list}
                    membersById={membersById}
                    onOpenCard={setSelectedCardId}
                    onAddCard={handleAddCard}
                  />
                ))
            )}

            <div className="w-[280px] shrink-0 rounded-md border border-rule bg-surface p-2">
              <AddInline label="Add list" placeholder="List title" onSubmit={handleAddList} />
            </div>
          </div>

          <DragOverlay>
            {activeCard ? (
              <CardPreview
                card={activeCard}
                assignee={activeCard.assigneeId ? membersById.get(activeCard.assigneeId) : undefined}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {selectedCard && (
        <CardPanel
          key={selectedCard.id}
          card={selectedCard}
          members={members}
          onClose={() => setSelectedCardId(null)}
          onSave={(data) => handleSaveCard(selectedCard.id, data)}
          onDelete={() => handleDeleteCard(selectedCard.id)}
        />
      )}
    </div>
  );
}
