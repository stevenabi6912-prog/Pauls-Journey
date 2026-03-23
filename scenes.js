// ============================================================
//  PAUL'S JOURNEYS — Scene Data
//  The Damascus Road — Acts 9
// ============================================================

const SCENES = {

  // ══════════════════════════════════════════════════════════
  //  THE DAMASCUS ROAD
  // ══════════════════════════════════════════════════════════

  'intro': {
    title: 'The Persecutor',
    location: 'Jerusalem',
    scripture: 'Acts 9:1-2',
    background: 'default',
    journey: 'The Damascus Road',
    narrative: `The year is 34 AD. You are Saul of Tarsus — Pharisee of Pharisees, trained at the feet of Gamaliel in the great city of Jerusalem. The Law of Moses is the breath in your lungs. You have devoted your life to it, shaped every thought by it, and you will defend it with everything you have.

You stood by and gave your approval as the crowd stoned Stephen. You watched as this so-called martyr lifted his eyes to heaven and blasphemed, and you felt nothing but righteous fury. Now the movement he died for has taken root — men and women across Judea whispering the name of Jesus of Nazareth, calling themselves the Way.

The High Priest has summoned you. On his table lie letters — official documents bearing the seal of the Sanhedrin, addressed to the synagogues of Damascus. The letters grant you authority to arrest any man or woman who follows the Way and drag them back to Jerusalem in chains.

You take the letters. You breathe threats and murder like other men breathe air. The Way will be extinguished. God, you are certain, demands it.`,
    character: 'The High Priest',
    dialogue: '"Go to Damascus. Seek them out in the synagogues. If you find any belonging to the Way, men or women, bring them bound to Jerusalem." — Acts 9:2',
    choices: [
      {
        text: 'Take the letters and prepare to ride north for Damascus',
        nextScene: 'departure',
        effect: {}
      }
    ]
  },

  'departure': {
    title: 'The Road North',
    location: 'Jerusalem',
    scripture: 'Acts 9:3',
    background: 'road',
    journey: 'The Damascus Road',
    narrative: `Before dawn you are already moving. A company of men rides with you — temple guards and officers loyal to the Sanhedrin. The gates of Jerusalem creak open and you pass through, torches trailing smoke in the cool morning air. The city falls behind you, and the road north stretches ahead into shadow.

The journey to Damascus is one hundred and thirty-five miles through rugged, ancient country. The road winds through limestone hills, past lonely shepherd camps and fields of barley baked pale by the summer sun. You ride in silence mostly, reviewing the names you've been given, rehearsing the arguments you will make.

You feel entirely certain. Entirely righteous. The letters sit against your chest, warm with your body heat. Damascus is perhaps six days' ride — and at the end of it, justice.

By the sixth day the city's white walls shimmer on the horizon. You urge your horse faster.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Press on toward Damascus — the city is nearly in sight',
        nextScene: 'nearing_damascus',
        effect: {}
      }
    ]
  },

  'nearing_damascus': {
    title: 'Something Is Coming',
    location: 'Road to Damascus',
    scripture: 'Acts 9:3',
    background: 'road',
    journey: 'The Damascus Road',
    narrative: `The walls of Damascus are close now — perhaps two miles. The road descends from the last ridge through a dry valley of pale dust and scattered thornbush. Your horse moves beneath you in a long, steady canter, and the air smells of heat and old stone.

Then your horse slows without your urging. Its ears pin back. Its body goes rigid beneath you, each step reluctant and tense, hooves striking the ground harder than before. The men behind you murmur. Their horses are doing the same.

You look up at the sky. The noon sun is overhead — fierce, blinding, exactly where it should be.

And then it is not.

Something else is coming. The shadows on the ground change. A brightness builds at the edge of vision — not from the south where the sun hangs, but from everywhere at once. The air itself begins to change. Your horse lets out a sharp, panicked cry and rears beneath you —`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Fight to control your horse as the light grows unbearable...',
        nextScene: 'light_begins',
        effect: {}
      }
    ]
  },

  'light_begins': {
    title: 'The Light Blazes',
    location: 'Road to Damascus',
    scripture: 'Acts 9:3',
    background: 'light',
    journey: 'The Damascus Road',
    specialScene: 'horse_ride',
    narrative: `The light erupts. Not from any direction — from everywhere. Brighter than the sun. Brighter than anything that belongs to this world. Your horse screams and bucks, wild with terror, every muscle beneath you coiled and snapping.

The reins are burning fire in your hands. The world has become pure white chaos. Hold on —`,
    character: null,
    dialogue: null,
    choices: []
  },

  'look_at_light': {
    title: 'Brighter Than the Sun',
    location: 'Road to Damascus',
    scripture: 'Acts 9:3',
    background: 'light',
    journey: 'The Damascus Road',
    specialScene: 'look_light',
    narrative: `You have fallen. The ground is beneath you but you cannot feel it. There is only the light — vast, total, absolute. It presses through your closed eyelids as though your eyelids are made of nothing.

Something inside you says: look at it.`,
    character: null,
    dialogue: null,
    choices: []
  },

  'voice_of_jesus': {
    title: 'A Voice from Heaven',
    location: 'Road to Damascus',
    scripture: 'Acts 9:4',
    background: 'light',
    journey: 'The Damascus Road',
    narrative: `You are on the ground. The dust is real beneath your palms. The light still blazes — your eyes are open and you are blind. Somewhere behind you your companions have gone completely still and silent. You can hear them breathing, rapid and afraid.

Then, out of the light, a voice. It speaks your name — not as an accusation, not as a battle cry, but with something worse: sorrow.

You press your face into the dust and you feel, for the first time in years, the specific and terrible weight of everything you have done.`,
    character: 'The Voice of the Lord',
    dialogue: '"Saul, Saul, why do you persecute me?" — Acts 9:4',
    choices: [
      {
        text: '"Who are you, Lord?" — the question escapes before you can stop it',
        nextScene: 'jesus_answers',
        effect: {}
      }
    ]
  },

  'jesus_answers': {
    title: 'I Am Jesus',
    location: 'Road to Damascus',
    scripture: 'Acts 9:5-6',
    background: 'light',
    journey: 'The Damascus Road',
    narrative: `Four words. That is all it takes to undo thirty years of certainty.

I am Jesus. The man you have been hunting. The man whose followers you have dragged from their homes at dawn, whose names fill the warrants in your saddlebag. He is alive. He is here. And every blow you have ever struck against his people — he has felt each one as though it landed on his own body.

The enormity of it presses down on you like a collapsing ceiling. You cannot argue. You cannot reach for the Law. There is no Law for this moment. There is only the voice, and you, face-down in the dust on a road outside Damascus, and the silence of men who have no idea what is happening but know they are very close to something holy and terrible.

He tells you to rise. He tells you to go into the city. And then — silence.`,
    character: 'The Lord Jesus',
    dialogue: '"I am Jesus, whom you are persecuting. But rise and enter the city, and you will be told what you are to do." — Acts 9:5-6',
    choices: [
      {
        text: 'Rise — and discover that you cannot see',
        nextScene: 'blindness',
        effect: { faith: 30 }
      }
    ]
  },

  'blindness': {
    title: 'Three Days of Darkness',
    location: 'Damascus',
    scripture: 'Acts 9:9',
    background: 'prison',
    journey: 'The Damascus Road',
    narrative: `Your men lead you by the hand into Damascus. The great persecutor — the terror of the synagogues — stumbling through the gates of the city like a blind beggar. They bring you to the house of a man called Judas on Straight Street, and there they leave you.

You do not eat. You do not drink. For three days you sit in absolute darkness — not just the darkness of sealed eyes, but the darkness of a man whose entire identity has shattered. Everything you knew about God, about the Messiah, about righteousness — you understood none of it. You were wrong about all of it. And in your wrongness, you had torn families apart.

You pray. It is all you have left. Hour after hour, in that dark room, you pray — not with the polished words of a Pharisee reciting scripture before the synagogue, but with the raw, broken voice of a man undone.

Somewhere in the third night, a kind of peace begins to settle. Not an answer. Not yet. Just peace.`,
    character: 'Saul, in the darkness',
    dialogue: '"And for three days he was without sight, and neither ate nor drank." — Acts 9:9',
    choices: [
      {
        text: 'Wait and pray — trust that what he said will come true',
        nextScene: 'ananias_arrives',
        effect: { faith: 20 }
      }
    ]
  },

  'ananias_arrives': {
    title: 'The Man Called Ananias',
    location: 'Damascus',
    scripture: 'Acts 9:17',
    background: 'synagogue',
    journey: 'The Damascus Road',
    narrative: `On the third day you hear footsteps outside the door. Then it opens — and light floods in, or perhaps it is only a lamp, but after three days it feels like sunlight. A man enters. His sandals scrape on the stone floor. He crosses the room and stops before you.

He knows your name. He has been sent. He tells you this directly, without preamble — the Lord Jesus, the one who appeared to you on the road, has sent him. He is a disciple. One of the very people you came to Damascus to arrest.

He could have refused. He told you himself, later — the Lord had to speak to him twice before he came, because he knew who you were. He knew what you had done to believers in Jerusalem. He came anyway.

His hands rest on your shoulders. Warm, steady, unafraid. And he speaks your name not with judgment but with tenderness — calling you brother.`,
    character: 'Ananias',
    dialogue: '"Brother Saul, the Lord Jesus who appeared to you on the road by which you came has sent me so that you may regain your sight and be filled with the Holy Spirit." — Acts 9:17',
    choices: [
      {
        text: 'Receive his hands — receive healing, receive the Spirit',
        nextScene: 'sight_restored',
        effect: { faith: 50 },
        nameChange: 'Paul',
        roleChange: 'Apostle · Called by Christ'
      }
    ]
  },

  'sight_restored': {
    title: 'Scales Fall',
    location: 'Damascus',
    scripture: 'Acts 9:18',
    background: 'default',
    journey: 'The Damascus Road',
    narrative: `It happens instantly. Something like scales — that is the only word for it — falls from your eyes. The world floods back in: the low ceiling of the room, the lamp's flame, the face of Ananias looking at you with a smile that holds no triumph, only joy.

You can see.

He takes you down to the water and baptizes you. The cold of it is a shock and a relief. When you come up from under the surface you are already different — you knew it before the water, but the water makes it real. The name Saul belongs to the man who rode out of Jerusalem with murder in his heart. You are not sure who you are yet, but you know who sent you.

You eat. After three days of nothing, the bread and water taste like a feast. Your strength comes back slowly, warmth moving through your limbs. You are alive. You are new.

The letters from the High Priest are still in your bag. You will not be using them.`,
    character: 'The Record of Luke',
    dialogue: '"And immediately something like scales fell from his eyes, and he regained his sight. Then he rose and was baptized." — Acts 9:18',
    choices: [
      {
        text: 'Rise — and begin the journey as Paul',
        nextScene: 'level_complete',
        effect: { faith: 20 },
        completeJourney: 'The Damascus Road'
      }
    ]
  },

  'level_complete': {
    title: 'Preaching in Damascus',
    location: 'Damascus',
    scripture: 'Acts 9:20',
    background: 'synagogue',
    journey: 'The Damascus Road',
    narrative: `Within days you are in the synagogues of Damascus — the same synagogues you rode from Jerusalem to purge. The same rooms. But now you stand on the other side.

The people who hear you stare. Some who know your reputation lean over to each other and whisper. You can see the confusion in their faces — this is the man who destroyed believers in Jerusalem, who came here with letters to arrest us. And now he is proclaiming Jesus.

You do not soften it or apologize for the boldness of it. You simply tell them what happened on the road. What you heard. What you saw. What fell from your eyes. The Jesus you persecuted is the Son of God. You are as sure of this as you were once sure of the opposite — but now your certainty is not made of anger. It is made of wonder.

The journey has only just begun.`,
    character: 'The Record of Luke',
    dialogue: '"And immediately he proclaimed Jesus in the synagogues, saying, 'He is the Son of God.'" — Acts 9:20',
    choices: [
      {
        text: 'Continue the journey of Paul',
        nextScene: 'intro',
        effect: {}
      }
    ]
  }

};
