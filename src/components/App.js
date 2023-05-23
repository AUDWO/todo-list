import ReviewList from "./ReviewList";
import { getReviews } from "../api";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import { createReview } from "../api";
import { updateReview } from "../api";

const LIMIT = 6;

function App() {
  //영화 list들을 담고있는 items State
  const [items, setItems] = useState([]);

  //createdAt으로 기준을 정할건지 rating으로 정할건지 결정하는 order State
  const [order, setOrder] = useState("createdAt");

  //offset 페이징기법 개수를 담는 offset State
  const [offset, setOffset] = useState(0);

  //영화 list들이 모두 나왔을떄 더보기 버튼을 없애기 위해 paging.hasNext를 담고 있는 hasNext State
  const [hasNext, setHasNext] = useState(false);

  //더보기 버튼 존재 여부
  const [isLoading, setIsLoading] = useState(false);

  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");
  const handleBestClick = () => setOrder("rating");

  //자식 컴포넌트에서 id값을 item.id값으로 전달해줌
  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  //영화 리스트들을 불러오는 메소드
  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }

    const { reviews, paging } = result;
    //맨 처음에는 offset이 0일 것이다.
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      //offset이 변경되면 새로운 영화 list들만 reviews에 담긴다.
      //이후 offset이 변경되면 영화 list들을 담은 items도 업데이트를 해줘야 한다.
      //...items가 기존에 영화 list들
      //...reviews가 새로 받아온 영화 list들
      setItems([...items, ...reviews]);
      //setItems((currentItems) => [...currentItems, ...reviews]);
    }
    //offset값과 hasNext값만 미리 바꿔서 나중에 함수를 실행하면 그때 적용하게 함
    setOffset(options.offset + reviews.length);
    //true값인지 false값인지 따진다.
    setHasNext(paging.hasNext);
    //state값이 변경되더라도 해당 state값이 렌더링에 영향을 미치는 값이 아니라면
    //따로 렌더링 하지 않는다
    //offset값과 ha
  };

  //영화리스트들을 불러오기 위해 사용하는 메소드
  //이전에 변경된 offset값을 파라미터로 넘겨 다시 handleLoad를 실행해 ->
  //새로운 영화 list들을 보여준다.
  const handleLoadMore = () => {
    //order: createdAt ||
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  //새로운 리뷰를 받으면 items를 업데이트 시켜주는 함수
  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    //처음 handleLoad가 실행될 때를 나타냄
    //이후 handleLoadMore버튼을 통해서 다른 영화 list들을 보여줌

    //order값이 바뀌면 다시 useEffect가 작동함
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm
        onSubmit={createReview}
        onSubmitSuccess={handleCreateSuccess}
      />
      <ReviewList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateReview}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
