import { getStoryblokApi } from "@storyblok/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import ImgPopup from "../../components/imgPopup";

const QuestionView = () => {



  const router = useRouter();
  const storyblokApi = getStoryblokApi();
  const [data, setdata] = useState();
  let [qzNo, setqzNo] = useState(0);
  const [btStatus, setbtStatus] = useState(false);
  const [selectedAnswer, setselectedAnswer] = useState(false);
  const [popView, setPopView] = useState(false);

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
  const audioRef = useRef(null);
  const audio_locked = useRef(null);
  const audio_wrong = useRef(null);
  const audio_correct = useRef(null);
  const audio_letsplay = useRef(null);
  const audio_thinking = useRef(null);



  const playLetsPlay = () => {
    if (audio_letsplay.current) {
      audio_letsplay.current.play();
    }
  };

  const playThinking = () => {
    if (audio_thinking.current) {
      audio_thinking.current.loop = true;
      audio_thinking.current.play();
    }
  };

  useEffect(() => {

    playLetsPlay();
    // setTimeout(() => {
    // }, 700);

    setTimeout(() => {
      playThinking()
    }, 2000);


    return () => {
      if (audio_thinking.current) {
        audio_thinking.current.pause();
        audio_thinking.current.currentTime = 0;
      }
    };

  }, [qzNo]);


  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setTimeout(() => {
        const lockedAudio = audio_locked.current;
        lockedAudio.loop = true;
        lockedAudio.play();
      }, 3000);
    }
  };


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
    const slectedWrong = qz_opt.current.querySelectorAll('.active-wrong');

    console.log('slectedWrong', slectedWrong);

    if (slected.length == 1) {
      slected[0].classList.remove('active');
    }
    const coorectClass = qz_opt.current.querySelectorAll('.correct');
    if (coorectClass.length == 1) {
      coorectClass[0].classList.remove('correct');
      slectedWrong[0]?.classList.remove('active-wrong');
    }

    document.querySelector('.main-view').classList.remove('answer-won')
    document.querySelector('.main-view').classList.remove('answer-defeated')

  }

  const selectAnswer = (e, answer) => {

    audio_thinking.current.pause();
    audio_thinking.current.currentTime = 0;

    const slected = qz_opt.current.querySelectorAll('.active');

    if (e.target.localName == 'li') {
      if (slected.length == 1) {
        slected[0].classList.remove('active')
        e.target.classList.add('active')
      } else {
        e.target.classList.add('active')
      }
    }

    setselectedAnswer(false)


    if (e.target.id == answer) {
      setselectedAnswer(true)
    }

  }

  const revealAnswer = (answer) => {

    audio_thinking.current.pause();
    audio_thinking.current.currentTime = 0;

    console.log(selectedAnswer, answer);
    let correctAnswer = qz_opt.current.querySelector(`#${answer}`);
    correctAnswer.classList.add('correct')

    const revealEffect = document.querySelector('.main-view');
    const slected = qz_opt.current.querySelector('.active');

    if (selectedAnswer) {
      revealEffect.classList.add('answer-won');
      audio_wrong.current.play();
      audio_locked.current.pause();
    } else {
      revealEffect.classList.add('answer-defeated');
      audio_correct.current.play();
      audio_locked.current.pause();
      slected.classList.add('active-wrong');
    }
  }

  return (
    <div className="qz-container">{
      data &&
      <div>
        <div className=" flex items-center justify-center my-3">
          <img className="w-16" src={data.story.content.grp_img} alt="" />
          <h5 className="text-2xl font-bold ">{data.story.name}</h5>
        </div>
        <br />
        <div className="qz-list">

          <p className="text-sm text-gray-400">Question <span> {qzNo + 1} of {data.story.content.qz_blocks.length}</span></p>

          {
            <div>
              <div className="bg-slate-900 text-center py-8 px-5">
                <h3 className="text-5xl text-white my-3">{data.story.content.qz_blocks[`${qzNo}`].question_title}</h3>
              </div>
              <div className="mt-6  bg-black hover:cursor-pointer" onClick={() => setPopView(true)}>
                <img className="max-h-60 mx-auto" src={data.story.content.qz_blocks[`${qzNo}`].question_img[0]?.filename} alt="" />
              </div>
              <div onClick={playAudio}>
                <ul ref={qz_opt} className="qz-ul grid grid-cols-2 gap-9 mt-8 text-4xl" onClick={(e) => selectAnswer(e, data.story.content.qz_blocks[`${qzNo}`].answer)}>
                  <li className="qz-li bg-slate-900 border-white border-2 rounded-sm p-5 hover:scale-105 hover:transition ease-in-out duration-300 cursor-pointer" id="a"> <span className="text-slate-300">A </span>- {data.story.content.qz_blocks[`${qzNo}`].a}</li>
                  <li className="qz-li bg-slate-900 border-white border-2 rounded-sm p-5 hover:scale-105 hover:transition ease-in-out duration-300 cursor-pointer" id="b"> <span className="text-slate-300">B </span>-{data.story.content.qz_blocks[`${qzNo}`].b}</li>
                  <li className="qz-li bg-slate-900 border-white border-2 rounded-sm p-5 hover:scale-105 hover:transition ease-in-out duration-300 cursor-pointer" id="c"> <span className="text-slate-300">C </span>-{data.story.content.qz_blocks[`${qzNo}`].c}</li>
                  <li className="qz-li bg-slate-900 border-white border-2 rounded-sm p-5 hover:scale-105 hover:transition ease-in-out duration-300 cursor-pointer" id="d"> <span className="text-slate-300">D </span>-{data.story.content.qz_blocks[`${qzNo}`].d}</li>
                </ul>
              </div>

              <audio ref={audioRef} src='/audio/confirm.mp3' />
              <audio ref={audio_locked} src='/audio/confirm_loop.mp3' />
              <audio ref={audio_wrong} src='/audio/correct.mp3' />
              <audio ref={audio_correct} src='/audio/wrong.mp3' />
              <audio ref={audio_letsplay} src='/audio/lets_play.mp3' />
              <audio ref={audio_thinking} src='/audio/Thinkinng.mp3' />

              {
                popView && <ImgPopup qzOptions={data.story.content.qz_blocks[`${qzNo}`]} imgPath={data.story.content.qz_blocks[`${qzNo}`].question_img[0]?.filename} setPopView={setPopView} />
              }
            </div>
          }
          <div className="my-10 px-10 flex items-center justify-between fixed bottom-0 left-0 w-full">
            <div>
              <button className="px-4 py-3 cursor-pointer border border-solid " onClick={() => revealAnswer(data.story.content.qz_blocks[`${qzNo}`].answer)}>Reveal</button>
              {/* <label>{selectedAnswer ? 'Correct' : ''}</label> */}

            </div>
            <div className="flex gap-5">

              <button className="px-4 py-3 cursor-pointer border border-solid disabled:opacity-30 hover:text-slate-300" ref={bt_dec} onClick={() => derementQzNo()}>Previous</button>
              <button className="px-4 py-3 cursor-pointer border border-solid disabled:opacity-30 hover:text-slate-300" ref={bt_inc} onClick={() => incrementQzNo()}>Next</button>
            </div>
          </div>

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


