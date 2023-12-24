import { useEffect, useState } from "react";

interface ChatScrollProps {
  topRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean;
  loadMore: () => void;
  count: number;
}

const useChatScroll = ({
  hasNextPage,
  topRef,
  bottomRef,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  useEffect(() => {
    const topDiv = topRef.current;

    const handleScroll = () => {
      if (topDiv?.scrollTop == 0 && hasNextPage) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => topDiv?.removeEventListener("scroll", handleScroll);
  }, [loadMore, topRef]);

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

      console.log(
        distanceFromBottom,
        topDiv.scrollHeight,
        topDiv.scrollTop,
        topDiv.clientHeight
      );

      return distanceFromBottom <= 100;
    };

    if (handleAutoScroll()) {
      setTimeout(
        () =>
          bottomDiv?.scrollIntoView({
            behavior: "smooth",
          }),
        100
      );
    }
  }, [bottomRef, topRef, count, hasInitialized]);
};

export default useChatScroll;
