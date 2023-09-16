const ImgPopup = ({ imgPath, setPopView, qzOptions }) => {
  return (
    <div className="img-pop">
      <img src={imgPath} alt="" />
      <button onClick={() => setPopView(false)}>Close</button>
      <div className="img-pop__options">
        <div>A - {qzOptions.a}</div>
        <div>B - {qzOptions.b}</div>
        <div>C - {qzOptions.c}</div>
        <div>D - {qzOptions.d}</div>
      </div>
    </div>
  );
}

export default ImgPopup;