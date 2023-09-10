import { getStoryblokApi } from "@storyblok/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";


const QuestionView = () => {

  const router = useRouter();

  const storyblokApi = getStoryblokApi();

  const [data, setdata] = useState();
  let [qzNo, setqzNo] = useState(0);
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
  const audioRef = useRef(null);
  const audio_locked = useRef(null);
  const audio_wrong = useRef(null);
  const audio_correct = useRef(null);
  const audio_letsplay = useRef(null);
  const audio_thinking = useRef(null);

  useEffect(() => {

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

    setTimeout(() => {
      playLetsPlay();
    }, 500);

    setTimeout(() => {
      playThinking()
    }, 6000);


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
        lockedAudio.loop = true; // Set the loop attribute to true
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
    <div>{
      data &&
      <div>
        <div className="text-center my-3">
          <h5 className="text-3xl font-bold ">{data.story.name}</h5>
          <p className="text-sm text-slate-500">Please select the correct answer</p>
        </div>
        <br />
        <div className="qz-list">

          <p className="text-sm text-gray-400">Question <span> {qzNo + 1} of {data.story.content.qz_blocks.length}</span></p>

          {
            <div>
              <h3 className="text-3xl text-white my-3">{data.story.content.qz_blocks[`${qzNo}`].question_title}</h3>
              <div onClick={playAudio}>
                <ul ref={qz_opt} className="grid grid-cols-2 gap-4 mt-8" onClick={(e) => selectAnswer(e, data.story.content.qz_blocks[`${qzNo}`].answer)}>
                  <li className="bg-slate-500 rounded-sm p-5 hover:bg-opacity-80 cursor-pointer" id="a">A - {data.story.content.qz_blocks[`${qzNo}`].a}</li>
                  <li className="bg-slate-500 rounded-sm p-5 hover:bg-opacity-80 cursor-pointer" id="b">B -{data.story.content.qz_blocks[`${qzNo}`].b}</li>
                  <li className="bg-slate-500 rounded-sm p-5 hover:bg-opacity-80 cursor-pointer" id="c">C -{data.story.content.qz_blocks[`${qzNo}`].c}</li>
                  <li className="bg-slate-500 rounded-sm p-5 hover:bg-opacity-80 cursor-pointer" id="d">D -{data.story.content.qz_blocks[`${qzNo}`].d}</li>
                </ul>
              </div>

              <audio ref={audioRef} src='/audio/confirm.mp3' />
              <audio ref={audio_locked} src='/audio/confirm_loop.mp3' />
              <audio ref={audio_wrong} src='/audio/correct.mp3' />
              <audio ref={audio_correct} src='/audio/wrong.mp3' />
              <audio ref={audio_letsplay} src='/audio/lets_play.mp3' />
              <audio ref={audio_thinking} src='/audio/Thinkinng.mp3' />
              <div className="mt-6  bg-black">
                <img className="max-h-60 mx-auto" src={data.story.content.qz_blocks[`${qzNo}`].question_img[0]?.filename} alt="" />
              </div>
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


