import { useEffect, useState } from "react";

interface ChatScrollProps {
  topRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
}

const useChatScroll = ({
  shouldLoadMore,
  topRef,
  bottomRef,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  useEffect(() => {
    const topDiv = topRef.current;

    const handleScroll: () => void = () => {
      if (topDiv?.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, topRef, shouldLoadMore]);

  useEffect(() => {
    const bottomDiv = bottomRef.current;
    const topDiv = topRef.current;

    const handleAutoScroll: () => boolean = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (handleAutoScroll() && bottomDiv) {
      setTimeout(
        () =>
          bottomDiv?.scrollIntoView({
            behavior: "smooth",
          }),
        100
      );
    }
  }, [bottomRef, topRef, topRef.current?.scrollTop, count, hasInitialized]);
};

export default useChatScroll;
