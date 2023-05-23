import { useState } from "react";
import "./ReviewForm.css";
import FileInput from "./FileInput";
import RatingInput from "./RatingInput";

const INITIAL_VALUES = {
  title: "",
  rating: 0,
  content: "",
  imgFile: null,
};

function ReviewForm({
  //왜 INITIAL_VALUES를 사용하지 않고 다시 변수에 할당했나 생각해보기
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onCancel,
  //updateReview를 실행시켜주는 함수
  onSubmit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(null);

  //ReviewListItem한개에 대한 정보를 담아두는 value State
  const [values, setValue] = useState(initialValues);

  //handleInputChange에서 받아온 name, value를 바탕으로
  //values를 업데이트 시켜주는 함수
  //handleChange함수를 분리시켜준 이유:e.target.files[0]을 뽑아야 하기 때문.
  const handleChange = (name, value) => {
    setValue((prevValues) => ({
      //객체의 spread문법
      ...prevValues,
      //기존 객체의 값을 가지면서
      //특정값만 수정하고 싶을때
      //*참조값도 변경*
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    //input태그의 name과 value값 (e.target = input태그)
    //value는 e.target으로 부터 나오는 value이다.
    //즉 우리가 작성하는 value를 의미
    const { name, value } = e.target;
    handleChange(name, value);
  };
  //type이 submit인 button을 눌렀을때 실행되는 submit함수
  //우리가 입력한 값을 바탕으로 서버에 있는  itmes를 업데이트 시켜준다.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);

    let result;
    //직접 입력한 값을 바탕으로 서버에 있는 items를 업데이트 시켜주는 함수
    try {
      setSubmittingError(null);
      setIsSubmitting(true);
      //onSubmit은 updateReview함수를 실행시켜준다.
      //updateReview는 새로운 formData(review)를 기존items에 PUT시켜주는 함수
      result = await onSubmit(formData);
    } catch (error) {
      setSubmittingError(error);
      return;
    } finally {
      setIsSubmitting(false);
    }
    console.log("rrrrrr");
    console.log(result);
    console.log("tttttt");
    const { review } = result;
    //onSubmotSuccess() = handleSubmitSuccess()
    //handleSubmitSuccess()는 items를 업데이트 시켜주는 함수이다.
    onSubmitSuccess(review);
    setValue(INITIAL_VALUES);
  };

  return (
    <form className="ReviewForm" onSubmit={handleSubmit}>
      <FileInput
        name="imgFile"
        onChange={handleChange}
        initialPreview={initialPreview}
        value={values.imgFile}
      />

      <input name="title" value={values.title} onChange={handleInputChange} />

      <RatingInput
        name="rating"
        value={values.rating}
        onChange={handleChange}
      />

      <textarea
        name="content"
        value={values.content}
        onChange={handleInputChange}
      />
      <button type="submit" disabled={isSubmitting}>
        확인
      </button>

      {onCancel && <button onClick={onCancel}>취소</button>}
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
}

export default ReviewForm;

/*const handleChange = (e)=>{
  const {name, value} = e.target;
  setValues(prevV=>{prevV.})
}*/
