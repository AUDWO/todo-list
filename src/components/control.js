import { useState } from "react";

function Mycomponent({ value, onChange }) {
  const handleChange = (e) => {
    const nextValue = e.target.value.toUpperCase();
    onChange(nextValue);
  };
  //제어 컴포넌트:input의 value를 직접 제어하고 있음
  return <input value={value} onChange={handleChange} />;
}

function App() {
  const [value, setValue] = useState("");
  //Mycomponent는 제어함수라 input의 value값이 App의 valueState랑 같다.
  //따라서 setValue로 Mycomponent의 value를 제어 할 수 있다.
  const handleClear = () => setValue("");
  return (
    <div>
      <Mycomponent value={value} onChange={setValue} />
      <button onClick={handleClear}>지우기</button>
    </div>
  );
}

//제어 컴포넌트:
//1.인풋의 value값을 리액트에서 지정
//2.리액트에서 사용하는 값(state)과 실제 input값이 항상 일치
//=>따라서 인풋의 value값을 제어할 수 있기때문에 주로 권장되는 방법이다.

//비제어 컴포넌트:
//1.인풋의 value값을 리액트에서 지정하지 않음
//경우에 따라서 필요한 방법
