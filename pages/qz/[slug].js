import { getStoryblokApi } from "@storyblok/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";


const QuestionView = () => {

  const router = useRouter();

  const storyblokApi = getStoryblokApi();

  const [data, setdata] = useState();
  const [qzNo, setqzNo] = useState(0);
  const [btStatus, setbtStatus] = useState(false);

  const [selectedAnswer, setselectedAnswer] = useState(false);



  // load the draft version
  let sbParams = {
    version: "draft", // or 'published'
    // by_slugs: "blogs/"
  };


  useEffect(() => {
    const { slug } = router.query;

    storyblokApi.get(`cdn/stories/qz/${slug}`, sbParams)
      .then(response => {
        console.log(response.data)
        setdata(response.data)
      }).catch(error => {
        console.log(error)
      })

  }, []);



  const incrementQzNo = () => {
    setqzNo(++qzNo)
    setselectedAnswer(false)
    removeActiveClass()
  }

  const derementQzNo = () => {
    setqzNo(--qzNo)
    setselectedAnswer(false)
    removeActiveClass()

  }


  const bt_inc = useRef();
  const bt_dec = useRef();

  useEffect(() => {

    // console.log("qz no" + qzNo + 1);

    // console.log("lenght - " + data?.story.content.qz_blocks.length);

    // console.log(`qno is ${qzNo + 1} and length is ${data?.story.content.qz_blocks.length}`);

    if (qzNo + 1 == data?.story.content.qz_blocks.length) {
      bt_inc.current.setAttribute('disabled', '')
      bt_dec.current.removeAttribute('disabled', '')
      if (qzNo + 1 > data?.story.content.qz_blocks.length) {
        bt_dec.current.removeAttribute('disabled', '')
      }
    } else if (qzNo + 1 < data?.story.content.qz_blocks.length) {
      bt_inc.current.removeAttribute('disabled', '')
      if (qzNo + 1 == 1) {
        bt_dec.current.setAttribute('disabled', '')
      }
    }


  }, [qzNo]);



  const qz_opt = useRef();

  const removeActiveClass = () => {
    const slected = qz_opt.current.querySelectorAll('.active');
    if (slected.length == 1) {
      slected[0].removeAttribute('class')
    }

  }

  const selectAnswer = (e, answer) => {

    const slected = qz_opt.current.querySelectorAll('.active');

    if (e.target.localName == 'li') {
      if (slected.length == 1) {
        slected[0].removeAttribute('class')
        e.target.classList.add('active')
      } else {
        e.target.classList.add('active')
      }
    }

    setselectedAnswer(false)


    if (e.target.id == answer) {
      setselectedAnswer(true)
      console.log('correct');
    }

  }

  const revealAnswer = () => {
    console.log(selectedAnswer);
  }

  return (
    <div>{
      data &&
      <div>
        <div className="text-center my-3">
          <h5 className="text-3xl font-bold ">{data.story.name}</h5>
          <p className="text-sm text-slate-500">Please select the correct answer</p>
        </div>
        <br />
        <div className="qz-list">

          <p className="text-sm text-gray-500">Question No <span> {qzNo + 1}</span></p>

          {
            <div>
              <h3 className="text-2xl text-black my-3">{data.story.content.qz_blocks[`${qzNo}`].question_title}</h3>
              <ul ref={qz_opt} className="grid grid-cols-2 gap-4" onClick={(e) => selectAnswer(e, data.story.content.qz_blocks[`${qzNo}`].answer)}>
                <li className="border-solid border border-gray-300 rounded-sm p-5 hover:bg-slate-300" id="a">A - {data.story.content.qz_blocks[`${qzNo}`].a}</li>
                <li className="border-solid border border-gray-300 rounded-sm p-5 hover:bg-slate-300" id="b">B -{data.story.content.qz_blocks[`${qzNo}`].b}</li>
                <li className="border-solid border border-gray-300 rounded-sm p-5 hover:bg-slate-300" id="c">C -{data.story.content.qz_blocks[`${qzNo}`].c}</li>
                <li className="border-solid border border-gray-300 rounded-sm p-5 hover:bg-slate-300" id="d">D -{data.story.content.qz_blocks[`${qzNo}`].d}</li>
              </ul>

            </div>
          }
          <br></br>
          <button ref={bt_dec} onClick={() => derementQzNo()}>-</button>
          <button ref={bt_inc} onClick={() => incrementQzNo()}>+</button>
          <button onClick={() => revealAnswer()}>Reveal</button>
          <label>{selectedAnswer ? 'Correct' : ''}</label>

          <br></br>
          <br></br>
          <br></br>
          <br></br>


        </div>
      </div>
    }
    </div>
  );
}

export default QuestionView;


