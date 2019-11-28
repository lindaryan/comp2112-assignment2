const api = 'https://opentdb.com/api.php?amount=15&category=18&type=multiple';

const money = [
  { level: '15', amount: '1,000,000' },
  { level: '14', amount: '500,000' },
  { level: '13', amount: '250,000' },
  { level: '12', amount: '100,000' },
  { level: '11', amount: '50,000' },
  { level: '10', amount: '25,000' },
  { level: '9', amount: '16,000' },
  { level: '8', amount: '8,000' },
  { level: '7', amount: '4,000' },
  { level: '6', amount: '2,000' },
  { level: '5', amount: '1,000' },
  { level: '4', amount: '500' },
  { level: '3', amount: '300' },
  { level: '2', amount: '200' },
  { level: '1', amount: '100' },
];
// const sounds = new Audio[('sounds/Round1.ogg', 'sounds/Round2.ogg', 'sounds/Round3.ogg', 'sounds/RightAnswer.ogg', 'sounds/WrongAnswer.ogg', 'sounds/Fifty50.ogg', 'sounds/AskAudience.ogg')];
// const round1 = new Audio('../sounds/Round1.ogg');
// const round2 = new Audio('../sounds/Round2.ogg');
// const round3 = new Audio('../sounds/Round3.ogg');
// const rightAnswer = new Audio("../sounds/RightAnswer.ogg");
// const wrongAnswer = new Audio("../sounds/WrongAnswer.ogg");
// const music = new Audio('');
const speech = new SpeechSynthesisUtterance;

new Vue({
  el: '#app',
  data: {
    api,
    money,
    questions: [],
    play: false,
    qIndex: 0,
    question: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    correctLetter: '',
    
    speech,
    recognition: null
    // sounds,
    // round1,
    // round2,
    // round3
  },
  // fetches the questions
  async created() {
    const res = await fetch(this.api);
    const data = await res.json();
    this.questions = data.results;
  },
  watch: {
     qIndex() {
       this.displayQ();
      //  this.audioLevel();
     }
  },
  methods: {
    beginGame() {
      this.play = true;
      this.displayQ();
      // Play round1 audio
      // round1.play();
    },
      // displays the questions
    displayQ() {
      this.parseCurrQ();
      this.shuffleAnswers();
      this.speak();
      this.speechRecognition();
    },

    // current question and correct answer
    parseCurrQ() {
      this.question = this.questions[this.qIndex].question;
      this.correctAnswer = this.questions[this.qIndex].correct_answer;
      // this.speak(this.question);
    },
    // shuffle answers so correct answer is randomly placed a/b/c/d
    shuffleAnswers() {
      const answers = [this.correctAnswer, ...this.questions[this.qIndex].incorrect_answers];
      answers.sort(() => Math.random() - 0.5);
      // this.answers = answers;
      [this.answer1, this.answer2, this.answer3, this.answer4] = answers;
      this.correctLetter = answers.findIndex(a => a === this.correctAnswer);
      // this.speak(this.answer1 + this.answer2 + this.answer3 + this.answer4);
    },

    speak() {
    // speak(text) {
      speech.lang = 'en-US';
      speech.text = this.question + ", A " + this.answer1 + ", B " + this.answer2 + ", C " + this.answer3 + ", or D " + this.answer4;
      // this.speech.text = text;
      speechSynthesis.speak(speech);      
    },

    // checks if selected answer is correct by matching index of correctAnswer to a/b/c/d
    isAnswer(letter) {
      const input = ['a', 'b', 'c', 'd'];
      const index = input.findIndex(char => char === letter);
      // console.log(letter)
      // if answer is correct, move to next question
      if(index === this.correctLetter)
        {
          // rightAnswer.play();
          this.qIndex += 1;
        }
      // if answer is incorrect, stop game
      else {
        this.play = false;
        this.qIndex = 0;
      }
    },
    speechRecognition() {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.lang = "en-US";
  
      recognition.addEventListener("result", e => {
        let transcript = e.results[0][0].transcript;
        // ensure browser registers voice
        console.log(transcript);
        switch (transcript) {
          case 'a final answer':
            this.isAnswer('a');
            break;
          case 'a final answer':
            this.isAnswer('b');
            break;
          case 'a final answer':
            this.isAnswer('c');
            break;
          case 'a final answer':
            this.isAnswer('d');
            break;                    
        }
      });
          recognition.addEventListener('end', recognition.start);
          recognition.start();
    },




    // playMusic() {
    //   music.loop = true;
    //   music.play();
    // },
    // audioLevel() {
    //   if(this.qIndex <= 5) {
        // round1.play();
    //   } else if (this.qIndex <= 12) {
    //     round2.play();
    //   } else {
    //     round3.play();
    //   }
    //   this.playMusic();
    // }
  },

  
})
