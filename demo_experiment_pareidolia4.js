// Task 4 of the face pareidolia Experiment
const jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }, 
});

// Fullscreen block
let block_fullscreen = {
  type: jsPsychFullscreen,
  message:
  `
    <div style="text-align: Left ;margin-left: auto; margin-right: auto; width: 70%;">
    <p><b>This experiment is designed to be run on a PC and is not compatible with mobile devices.</b></p>
    <p>Clicking the button below will start the experiment in fullscreen mode. Please remain in fullscreen for the duration of the task.<br>
    </p>
    <p><small style="color: #5e5e5e;">Depending on your browser settings (e.g., Safari), you may need to enter fullscreen mode manually.</small></p>
    </div>
  `,
  fullscreen_mode: true,
  data: {
    block: "fullscreen",
  },
  on_load: function() {
    // 'div'要素を新しく作成
    const demoBanner = document.createElement('div');
    // CSSで指定したIDを付与
    demoBanner.id = 'demo-banner';
    // 表示したいテキストを設定
    demoBanner.textContent = 'This is a DEMO';
    // ページのbodyに要素を追加
    document.body.appendChild(demoBanner);
  }
};

// Stimuli URIs
const conditions = [
  {stimulus_name:'demo_01', stimulus_uri: demo_01},
  {stimulus_name:'demo_02', stimulus_uri: demo_02}
];

// Instruction Block for the Experiment
let block_intro_task = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
  `
    <h2>Task Instructions</h2>
    <div style="text-align: left; margin-left: auto; margin-right: auto; width: 80%; max-width: 1280px;">
      <p>Thank you for participating in this experiment.</p>
      <p>In this experiment, you will be presented with photographs of objects and scenes that may resemble human faces (e.g., a rock wall, windows on a building). Your task is to evaluate how these illusory faces appear from various perspectives.</p>
      <p>The experiment consists of two main parts:</p>
      <ul>
        <li type="disc">Rating the perceived age and gender of the "face" in the photograph.</li>
        <li type="disc">Rating the configuration of the "face" in the photograph.</li>
      </ul>
      <p>Detailed instructions will be provided at the beginning of each part.</p>
      <p>The estimated duration of the experiment is about 10 minutes.</p>
      <p>Please press the button below to start the first task.</p>
    </div>
  `,
  choices: ["Proceed to the first task"],
  data: {
    stimulus: null,
    block: "intro_task",
  },
};

// Instruction block for the first evaluation task
let block_intro_evaluation = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h2>Instructions for Task 1</h2>
    <div style="text-align: Left; margin-left: auto; margin-right: auto; width: 80%;max-width: 1280px;">
      <p>In this task, an image of an illusory face will be presented alongside several questions.</p>
      <p>Your task is to <span style='color: red; font-weight: bold'>answer each question based on your impression of the presented face-like image</span>.</p>
      <p>Please make all your responses by dragging the sliders.</p>
      <p>When you are ready, press the button below to begin.</p>
    </div>
  `,
  choices: ["Begin Task"],
  data: {
    stimulus: null,
    block: "intro_evaluation",
  },
};

// Number of trials in the evaluation block
let trialNum_evaluation = conditions.length * 2
let trial_count_evaluation = 1;

// Face Pareidolia Evaluation Block
let trial_evaluation = {
  type: jsPsychP5,
  sketch:
  (p) => {
    let trial = jsPsych.getCurrentTrial();

    let aspectRatio = "16 / 10";
    let maxWidth = 890;
    let maxHeight = 500;

    let canvasWidth = 250; // キャンバスの幅
    let canvasHeight = 250; // キャンバスの高さ

    let trial_condition = jsPsych.timelineVariable('stimulus_uri');
    let button;

    p.setup = () => {
      let questionHead = p.createDiv(
        `<h4>
           Please answer the questions below about the "face" shown on the left.<br>
           If you cannot see a face in the image, please check the box below.
         </h4>`
      )

      let mainContainer = p.createDiv('');
      mainContainer.attribute('style', `
        width: 100vw;
        height: auto;
        aspect-ratio: ${aspectRatio};
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: ${maxWidth}px;
        max-height: ${maxHeight}px;
      `)

      let imageContainer = p.createDiv('');
      imageContainer.attribute('style', `
        width: 50%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 15px
      `);
      imageContainer.parent(mainContainer);

      let img = p.createImg(trial_condition, 'Stimulus image');
      img.size(canvasWidth, canvasHeight);
      img.parent(imageContainer);

      let controlsContainer = p.createDiv('');
      controlsContainer.attribute('style', `
        width: 50%;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 15px;
        max-width: 320px;
      `);
        controlsContainer.parent(mainContainer);

      let minSlider = 0;
      let maxSlider = 80;
      let defaultValue = 40;

      let textAgeContainer = p.createDiv(
        'What is the perceived <strong>age</strong>?'
      );
      textAgeContainer.attribute('style', `
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      `);
      textAgeContainer.parent(controlsContainer);
      
      let ansAge = p.createDiv()
        .style("color", "rgb(50,115,246");
      ansAge.parent(textAgeContainer);

      let sliderAge = p
        .createSlider(minSlider, maxSlider, defaultValue, 1)
        .size(200);
      sliderAge.parent(controlsContainer);

      ansAge.html(sliderAge.value() + ' years old');
      sliderAge.input(() => {
        ansAge.html(sliderAge.value() + ' years old');
        button.removeAttribute("disabled");
      });

      let textLabelAgeContainer = p.createDiv();
      textLabelAgeContainer.attribute('style', `
        width: calc(100% - 50px);
        display: flex;
        justify-content: space-between;
        margin-top: 1px;
      `);
      textLabelAgeContainer.parent(controlsContainer);

      let textAgeLeft = p.createDiv(`0`).parent(textLabelAgeContainer);
      let textAgeRight = p.createDiv(`${maxSlider}`).parent(textLabelAgeContainer);

      let minSliderFem = 0;
      let maxSliderFem = 100;
      let defaultValueFem = 50;

      let textFemContainer = p.createDiv(
        'How <strong>feminine</strong> does the face appear?'
      );
      textFemContainer.attribute('style', `
        text-align: center;
        margin-top: 50px;
        margin-bottom: 10px;
      `);
      textFemContainer.parent(controlsContainer);

      let ansFem = p.createDiv()
        .style("color", "rgb(50,115,246");
      ansFem.parent(textFemContainer);

      let sliderFem = p
        .createSlider(minSliderFem, maxSliderFem, defaultValueFem, 1)
        .size(200);
      sliderFem.parent(textFemContainer);
      
      // @KT 回答をリアルタイムで表示
      ansFem.html(
        "Masculine " + (100 - sliderFem.value()) + "% Feminine " + sliderFem.value() + "%"
      );
      sliderFem.input(() => {
        ansFem.html(
          "Masculine " +
            (100 - sliderFem.value()) +
            "% Feminine " +
            sliderFem.value() +
            "%"
        );
        button.removeAttribute("disabled");
      });

      let textLabelFemContainer = p.createDiv();
      textLabelFemContainer.attribute('style', `
        width: calc(100% - 50px);
        display: flex;
        justify-content: space-between;
      `);
      textLabelFemContainer.parent(controlsContainer);

      let textFemLeft = p.createDiv("Masculine").parent(textLabelFemContainer); // 左側のテキスト
      let textFemRight = p.createDiv("Feminine").parent(textLabelFemContainer); // 右側のテキスト

      // 顔が見えなかった時のチェックボックス
      NotFacecheckbox = p.createCheckbox(' I cannot see a face in the image');
      NotFacecheckbox.parent(controlsContainer);
      NotFacecheckbox.attribute('style', `
        margin-top: 1.5rem;
        transform: scale(clamp(1, 2vw, 3));
        color: blue;
      `);

      const updateSliderState = (disabled) => {
        const color = disabled ? '#757575' : '';
        if (disabled) {
          sliderAge.attribute('disabled', 'disabled');
          sliderFem.attribute('disabled', 'disabled');
          button.removeAttribute("disabled");
        } else {
          sliderAge.removeAttribute('disabled');
          sliderFem.removeAttribute('disabled');
          button.attribute("disabled", "disabled");
        }
        sliderAge.style('color', color);
        sliderFem.style('color', color);
        textAgeContainer.style('color', color);
        textFemContainer.style('color', color);
        textLabelAgeContainer.style('color', color);
        textLabelFemContainer.style('color', color);
      };

      NotFacecheckbox.changed(() => {
        updateSliderState(NotFacecheckbox.checked());
      });

      button = p.createButton("Submit")
      .style('font-size', `clamp(12px, 2vw, 24px)`)
      button.attribute("disabled", "disabled");

      trial_remaining = p.createDiv(`${trial_count_evaluation}/${trialNum_evaluation}`);
      trial_remaining.style("margin-top", "20px");

      let startTime = p.millis();

      button.mousePressed(() => {
        let faceNotVisibleChecked = NotFacecheckbox.checked();

        trial_count_evaluation++;
        trial.data.stimulus_source = jsPsych.timelineVariable('stimulus_name', true);
        trial.data.Age = sliderAge.value();
        trial.data.Feminisity = sliderFem.value();
        trial.data.elapsedTime = p.millis() - startTime;
        trial.data.faceNotVisible = faceNotVisibleChecked;
        p.clear();

        trial.end_trial();
      });
    }
  },
  data: {
    response: null,
  },
};

// Generate test blocks for evaluation trial
let block_trial_evaluation_test = {
  timeline_variables: conditions,
  timeline: [trial_evaluation],
  repetitions: 1,
  randomize_order: true,
  data: {
    block: "test",
  },
  post_trial_gap: 500,
};

// Generate retest blocks
let block_trial_evaluation_retest = {
  timeline_variables: conditions,
  timeline: [trial_evaluation],
  repetitions: 1,
  randomize_order: true,
  data: {
    block: "retest",
  },
  post_trial_gap: 500,
};

// Instruction block for the pointing (face configuration) task
let block_intro_pointing_face_configuration = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h2>Instructions for Task 2</h2> 
    <div style="text-align: Left; margin-left: auto; margin-right: auto; width: 80%;max-width: 1280px;">
      <p>In this task, you will be asked to indicate the perceived locations of the parts of the face-like image.</p>
      <p>Please indicate the perceived locations for <span style='color: red; font-weight: bold'>the top of the face, bottom of the face, left eye, right eye, and mouth</span> by moving the corresponding circles.</p>
      <p>As demonstrated in the image below, you will respond by <span style='color: red; font-weight: bold'>dragging and placing the colored circles onto their corresponding locations</span>.</p>
      <ul>
          <li type="disc"><b>Top & Bottom of Face:</b> Place these circles at the <b>upper and lower boundaries</b> of the area you perceive as the face.</li>
          <li type="disc"><b>Right & Left Eye:</b> <span style="color: red;">Place the "Right Eye" circle on the eye that appears on the right side of the image from your perspective, and the "Left Eye" circle on the one that appears on the left.</span></li>
      </ul>
      <p>Once you have placed all the circles, press the "Submit" button to confirm your response.</p>
      <p>If you cannot see a face in the image, do not need to place the circles. Instead, please check the "I cannot see a face" option.</p>

      
      <p>When you are ready, press the button below to begin the task.</p>
    </div>
    <figure>
      <img src="${demo_intro}" alt="Instructions for face configuration" style="width: 80%;max-width: 1280px;"></img>
      <figcaption>Drag each circle to the <span style="color: red;">"center"</span> of the corresponding facial feature.</figcaption>
    </figure>
  `,
  choices: ["Begin Task"],
  data: {
    stimulus: null,
    block: "intro_configuration",
  },
};

// Number of trial experiments
let trialNum_pointing = conditions.length
let trial_count_pointing = 1;

// Face composition task for pareidolia
let pointing_face_configuration = {
    type: jsPsychP5,
    sketch:
    (p) => {
        let trial = jsPsych.getCurrentTrial();

        let canvasWidth = 500;
        let canvasHeight = 500;

        let aspectRatio = "16 / 10";
        let maxWidth = 890;
        let maxHeight = 500;

        let face_top_x, face_top_y, face_bottom_x, face_bottom_y;
        let left_eye_x, left_eye_y, right_eye_x, right_eye_y;
        let mouth_x, mouth_y;
        let dragging_face_top = false;
        let dragging_face_bottom = false;
        let dragging_left_eye = false;
        let dragging_right_eye = false;
        let dragging_mouth = false;
        let GRAB_RADIUS = 10;

        let MIN_EYE_DISTANCE = GRAB_RADIUS * 1
        let MIN_FACE_VERTICAL_DISTANCE = GRAB_RADIUS * 2; 

        let img; 
        let trial_condition = jsPsych.timelineVariable('stimulus_uri');

        p.preload = () => {
          img = p.loadImage(trial_condition);
        }

        p.setup = () => {
          let mainContainer = p.createDiv('');
          mainContainer.attribute('style', `
            width: 100vw;
            height: auto;
            aspect-ratio: ${aspectRatio};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: ${maxWidth}px;
            max-height: ${maxHeight}px;
          `)

          let questionHead = p.createDiv(
            `
            <h4>
              Drag the labeled circles on the image to their corresponding locations.
            </h4>
            <div style="text-align: Left; margin-left: auto; margin-right: auto; width: 90%;max-width: 1280px;">
              <p>Reminder: Place the 'Top' and 'Bottom' circles at the <font color="red">upper and lower boundaries</font> of the area you perceive as the face.</p>
              <p>Place the other circles at the <font color="red">center of each feature</font> (eyes, mouth).</p>
              <p>Note: <font color="red">The labels may occasionally obscure parts of the image.</font> You can drag a circle away and back to see the area underneath.</p>
              <p>Some circles have placement restrictions; for example, <font color="red">the left eye cannot be dragged to the right of the right eye</font>.</p>
              <p>The 'Submit' button will be enabled after you <font color="red">select one of the options below</font>.</p>
            </div>
            `
          ).parent(mainContainer);

          canvas = p.createCanvas(canvasWidth, canvasHeight)
          canvas.parent(mainContainer);

          check_radio = p.createRadio();
          check_radio.attribute('style', `
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
            transform: scale(clamp(1, 2vw, 3));
            color: black;
          `);
          check_radio.parent(mainContainer);
          check_radio.option('A face is visible');
          check_radio.option('No face is visible');

          button = p.createButton("Submit")
          .style('font-size', `clamp(12px, 2vw, 24px)`)
          .attribute("disabled", "disabled")
          .style('color', '#757575')
          .parent(mainContainer);

          trial_remaining = p.createDiv(`${trial_count_pointing}/${trialNum_pointing}`);
          trial_remaining.style("margin-top", "20px");
          trial_remaining.parent(mainContainer);

          check_radio.changed(() => {
            const selected = check_radio.value();
            if (selected) {
              button.removeAttribute("disabled")
              .style('color', '');
            } else {
              button.attribute("disabled", "disabled")
              .style('color', '#757575');
            }
          });

          let startTime = p.millis();

          button.mousePressed(() => {
            let faceNotVisibleChecked = check_radio.value();
            trial_count_pointing++;
            trial.data.stimulus_source = jsPsych.timelineVariable('stimulus_name', true);
            trial.data.face_top_x = face_top_x;
            trial.data.face_top_y = face_top_y;
            trial.data.face_bottom_x = face_bottom_x;
            trial.data.face_bottom_y = face_bottom_y;
            trial.data.distance_face = p.dist(face_top_x, face_top_y, face_bottom_x, face_bottom_y);
            trial.data.left_eye_x = left_eye_x;
            trial.data.left_eye_y = left_eye_y;
            trial.data.right_eye_x = right_eye_x;
            trial.data.right_eye_y = right_eye_y;
            trial.data.eyes_midpoint_x = (left_eye_x + right_eye_x) / 2;
            trial.data.eyes_midpoint_y = (left_eye_y + right_eye_y) / 2;
            trial.data.mouth_x = mouth_x;
            trial.data.mouth_y = mouth_y;
            trial.data.distance_between_eyesmid_and_mouth = p.dist(trial.data.eyes_midpoint_x, trial.data.eyes_midpoint_y, mouth_x, mouth_y);
            trial.data.elapsedTime = p.millis() - startTime;
            trial.data.faceNotVisible = faceNotVisibleChecked;
            p.clear();

            trial.end_trial();
          });

            img_left_bound = canvasWidth / 2 - img.width / 2;
            img_right_bound = canvasWidth / 2 + img.width / 2;
            img_top_bound = canvasHeight / 2 - img.height / 2;
            img_bottom_bound = canvasHeight / 2 + img.height / 2;
            
            face_top_x = p.constrain(p.width / 2, img_left_bound, img_right_bound);
            face_top_y = p.constrain(p.height / 4, img_top_bound, img_bottom_bound);
            face_bottom_x = p.constrain(p.width / 2, img_left_bound, img_right_bound);
            face_bottom_y = p.constrain(p.height * 3 / 4, img_top_bound, img_bottom_bound);
            
            left_eye_x = p.constrain(p.width / 4, img_left_bound, img_right_bound);
            left_eye_y = p.constrain(p.height * 1.5 / 4, img_top_bound, img_bottom_bound);
            right_eye_x = p.constrain(p.width * 3 / 4, img_left_bound, img_right_bound);
            right_eye_y = p.constrain(p.height * 1.5 / 4, img_top_bound, img_bottom_bound);
            mouth_x = p.constrain(p.width / 2, img_left_bound, img_right_bound);
            mouth_y = p.constrain(p.height * 2.5 / 4, img_top_bound, img_bottom_bound);
            
            p.imageMode(p.CENTER);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);

            p.noLoop();
        };

        function drawDraggableCircle(x, y, label, color) {
            const GRAB_RADIUS = 10;
            const text_size = p.textSize();
            const box_padding = 5;

            p.fill(color);
            p.stroke(0);
            p.strokeWeight(1);
            p.ellipse(x, y, GRAB_RADIUS * 2);

            let text_width = p.textWidth(label);
            let text_height = text_size * 0.8;

            let text_x = x;
            let text_y = y - GRAB_RADIUS - 10 - text_height / 2;

            p.fill(255);
            p.rectMode(p.CENTER);
            p.rect(text_x, text_y, text_width + box_padding * 2, text_height + box_padding * 2);

            p.fill(0);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.text(label, text_x, text_y);
            p.rectMode(p.CORNER);
        };

        p.draw = () => {
            p.background(220);
            p.image(img,canvasWidth/2,canvasHeight/2);

            // 線を描画
            p.stroke(0);
            p.strokeWeight(5);
            p.line(face_top_x, face_top_y, face_bottom_x, face_bottom_y);
            p.line(left_eye_x, left_eye_y, right_eye_x, right_eye_y);
            p.noStroke();

            // 各点を描画
            drawDraggableCircle(face_top_x, face_top_y, "Top of head", p.color(255, 165, 0));
            drawDraggableCircle(face_bottom_x, face_bottom_y, "Chin tip", p.color(255, 165, 0));
            drawDraggableCircle(left_eye_x, left_eye_y, "Left eye", p.color(102, 255, 255));
            drawDraggableCircle(right_eye_x, right_eye_y, "Right eye", p.color(102, 255, 255));
            drawDraggableCircle(mouth_x, mouth_y, "Mouth", p.color(255, 102, 102));
        };

        p.mousePressed = () => {
          let d_face_top = p.dist(p.mouseX, p.mouseY, face_top_x, face_top_y);
          let d_face_bottom = p.dist(p.mouseX, p.mouseY, face_bottom_x, face_bottom_y);
          let d_left_eye = p.dist(p.mouseX, p.mouseY, left_eye_x, left_eye_y);
          let d_right_eye = p.dist(p.mouseX, p.mouseY, right_eye_x, right_eye_y);
          let d_mouth = p.dist(p.mouseX, p.mouseY, mouth_x, mouth_y);

          // 掴んでいる端を判定
          if (d_face_top < GRAB_RADIUS) {
            dragging_face_top = true;
          } else if (d_face_bottom < GRAB_RADIUS) {
            dragging_face_bottom = true;
          } else if (d_left_eye < GRAB_RADIUS) {
            dragging_left_eye = true;
          } else if (d_right_eye < GRAB_RADIUS) {
            dragging_right_eye = true;
          } else if (d_mouth < GRAB_RADIUS) {
            dragging_mouth = true;
          }
        }

        p.mouseDragged = () => {
          let newX = p.mouseX;
          let newY = p.mouseY;

          newX = p.constrain(newX, img_left_bound, img_right_bound);
          newY = p.constrain(newY, img_top_bound, img_bottom_bound);

          if (dragging_face_top) {
            face_top_x = newX;
            face_top_y = p.constrain(newY, img_top_bound, face_bottom_y - MIN_FACE_VERTICAL_DISTANCE);
          } else if (dragging_face_bottom) {
            face_bottom_x = newX;
            face_bottom_y = p.constrain(newY, face_top_y + MIN_FACE_VERTICAL_DISTANCE, img_bottom_bound);
          } else if (dragging_left_eye) {
            left_eye_x = p.constrain(newX, img_left_bound, right_eye_x - MIN_EYE_DISTANCE);
            left_eye_y = newY;
          } else if (dragging_right_eye) {
            right_eye_x = p.constrain(newX, left_eye_x + MIN_EYE_DISTANCE, img_right_bound);
            right_eye_y = newY;
          } else if (dragging_mouth) {
            mouth_x = newX;
            mouth_y = newY;
          }
          p.redraw();
        };


        p.mouseReleased = () => {
          dragging_face_top = false;
          dragging_face_bottom = false;
          dragging_left_eye = false;
          dragging_right_eye = false;
          dragging_mouth = false;
          p.redraw(); 
        };
    }
};

// Experiment block generation
let block_trial_pointing_face_configuration = {
  timeline_variables: conditions,
  timeline: [pointing_face_configuration],
  repetitions: 1,
  randomize_order: true,
  data: {
    block: "pointing",
  },
  post_trial_gap: 500,
};

// Debriefing
// let end_debriefing = {
//   type: jsPsychHtmlButtonResponse,
//   stimulus: function () {
//     return `
//       <div style="text-align: left; margin: 10px 100px;">
//         <p style = "text-align: left">全ての試行が終わりました。これで実験は終了となります。</p>
//         <p style = "text-align: left">今回の作業完了コードは下記のボタンを押すと表示されます。</p>
//         <p style = "text-align: left">表示される4桁の数字を、Yahoo!クラウドソーシングの設問への回答として<u>半角で</u>入力して下さい。</p>
//         <p style = "text-align: left">この数字の入力は<span style="color: red;">1度しかできない</span>ため、間違えないように十分に注意してください。</p>
//         <p style = "text-align: left">［完了コードを見る］ボタンを押すと報酬ポイント獲得用のコードが表示されます。表示された完了コードをメモしたらタブを閉じてください。ご協力ありがとうございました。</p>
//       </div>
//     `;
//   },
//   choices: ["完了コードを見る"],
//   data: {
//     stimulus: null,
//   },
//   on_finish: function (data) {
//     jsPsych.endExperiment('2390');
//   },
// };


jsPsych.run([
    block_fullscreen,
    block_intro_task,
    block_intro_evaluation,
    block_trial_evaluation_test,
    block_trial_evaluation_retest,
    block_intro_pointing_face_configuration,
    block_trial_pointing_face_configuration,
    // end_debriefing
]);