import "./ReviewList.css";
import Rating from "./Rating";
import ReviewForm from "./ReviewForm";
import { useState } from "react";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

//item값에 다양한 정보들이 있기 때문에 props의 프러퍼티를 많이 가져올 필요가 없다!!!
function ReviewListItem({ item, onDelete, onEdit }) {
  //ReviewListItem에서 받아온 item으로 고유 item id를 받아올 수 있다.
  //어차피 모둔 item에는 delete버튼이 있고 button이 눌려진 아이템은 한개일테니
  const handleDeleteClick = () => onDelete(item.id);

  const handleEditClick = () => {
    //onEdit = setEditingId
    onEdit(item.id);
    //editingId가 바뀌면서 다시 ReviewList는 다시 리렌더링 된다.
  };

  return (
    <div className="ReviewListItem">
      <img className="ReviewListItem-img" src={item.imgUrl} alt={item.title} />
      <div>
        <h1>{item.title}</h1>
        <Rating value={item.rating} />
        <p>{formatDate(item.createAt)}</p>
        <p>{item.content}</p>
        <button onClick={handleDeleteClick}>삭제</button>
        <button onClick={handleEditClick}>수정</button>
      </div>
    </div>
  );
}

function ReviewList({ items, onDelete, onUpdate, onUpdateSuccess }) {
  //editingId는 수정 할 요소의 id를 가진다.
  const [editingId, setEditingId] = useState(null);

  const handleCancel = () => setEditingId(null);

  return (
    <ul>
      {items.map((item) => {
        if (item.id === editingId) {
          console.log("item");
          console.log(item);
          console.log("item");
          const { id, imgUrl, title, rating, content } = item;

          const initialValues = { title, rating, content, imgFile: null };

          const handleSubmit = (formData) => onUpdate(id, formData);
          const handleSubmitSuccess = (reivew) => {
            onUpdateSuccess(reivew);
            setEditingId(null);
          };

          return (
            <li key={item.id}>
              <ReviewForm
                initialValues={initialValues}
                initialPreview={imgUrl}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </li>
          );
        }
        return (
          <li key={item.id}>
            <ReviewListItem
              item={item}
              onDelete={onDelete}
              onEdit={setEditingId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ReviewList;
