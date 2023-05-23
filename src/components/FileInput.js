import { useRef, useState, useEffect } from "react";

function FileInput({ name, value, initialPreview, onChange }) {
  const [preview, setPreview] = useState(initialPreview);

  //handleClearClick()를 실행시키기 위해 만들어준 ref
  const inputRef = useRef();

  //name과 새로운 value를 nextValue에 담아 업데이트 시켜주는 함수
  //우리가 직접 적는 input태그들은 거기에서 handleInputChange함수를 사용할 수 있지만
  const handleInputChange = (e) => {
    //input type="file"일때 접근하는 방식 e.target.files!!

    console.log("ffffffff");
    console.log(e.target.files);
    console.log("ssssssss");
    //어차피 나중에 e.taget.files 내부 값들은 없어지기 떄문에 [0]으로 해도 상관x
    const nextValue = e.target.files[0];

    //onChange함수를 통해 nextValue(File)를 values에 업데이트 시킴
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    console.dir(`aaaaaaa:${inputNode}`);
    console.log(inputNode.width);
    if (!inputNode) return;

    inputNode.value = "";
    onChange(name, null);
  };

  // value 프롭의 값이 바뀌면 -->
  //preview 스테이트 값이 바뀜 의 관계를 명확하게 드러내주기 위해서
  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    //사이드 이펙트 발생
    setPreview(nextPreview);

    //디펜던시 리스트 값이 바뀌어서 리렌더링 되면 콜백을 실행할텐데
    //새로 콜백을 실행하기 전에 리액트는 앞에서 리턴한 이 정리 함수를 실행
    //사이드 이펙트를 정리할 수 있게 해준다.
    return () => {
      setPreview(initialPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]);

  return (
    <div>
      <img src={preview} alt="이미지 미리보기" />
      <input type="file" onChange={handleInputChange} ref={inputRef} />
      {value && <button onClick={handleClearClick}>X</button>}
    </div>
  );
}

export default FileInput;
