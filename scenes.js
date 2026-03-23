// ============================================================
//  PAUL'S JOURNEYS — Scene Data
//  All scenes based on the Book of Acts
// ============================================================

const SCENES = {

  // ══════════════════════════════════════════════════════════
  //  ACT 0 — THE ROAD TO DAMASCUS
  // ══════════════════════════════════════════════════════════

  'intro': {
    title: 'The Persecutor',
    location: 'Jerusalem',
    scripture: 'Acts 8:1-3',
    background: 'default',
    journey: null,
    narrative: `The year is 34 AD. You are Saul of Tarsus — a Pharisee of Pharisees, trained at the feet of the great teacher Gamaliel in Jerusalem. You are zealous for the Law. Consumed by it.\n\nYou stood by and approved as the crowd stoned Stephen, a follower of the Way. You even held the coats of those who threw the stones.\n\nNow you march through Jerusalem with letters from the High Priest in your hands. Your mission: travel to Damascus and arrest every man and woman who belongs to this sect called "The Way." They must be silenced before this movement spreads any further.\n\nYou breathe threats and murder. It is, you tell yourself, the will of God.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Take the letters and ride for Damascus',
        nextScene: 'road_to_damascus',
        effect: {}
      }
    ]
  },

  'road_to_damascus': {
    title: 'The Road North',
    location: 'Road to Damascus',
    scripture: 'Acts 9:1-3',
    background: 'road',
    journey: null,
    narrative: `You ride north from Jerusalem with a company of men, the High Priest's letters sealed inside your robe. The road stretches through rugged hills. It is midday — the sun is fierce and high.\n\nDamascus is a day's journey away. You think of the followers of the Way hiding in that city. You think of their leader — Jesus of Nazareth, a carpenter who claimed to be the Messiah and was crucified like a criminal. You are certain: this movement is a disease, and you are the cure.\n\nThen — without warning — everything changes.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Ride on toward Damascus...',
        nextScene: 'blinding_light',
        effect: {}
      }
    ]
  },

  'blinding_light': {
    title: 'A Light from Heaven',
    location: 'Road to Damascus',
    scripture: 'Acts 9:3-6',
    background: 'light',
    journey: null,
    narrative: `Suddenly — a light from heaven, brighter than the noon sun, blazes all around you. You are thrown from your horse and crash onto the ground. Your companions stop dead, speechless, hearing a sound but seeing no one.\n\nYou lie face-down in the dust. Your eyes, wide open, see nothing but white. Then you hear it — a voice, speaking directly to you.`,
    character: 'A Voice from Heaven',
    dialogue: '"Saul, Saul, why do you persecute me?"',
    choices: [
      {
        text: '"Who are you, Lord?" you ask, trembling.',
        nextScene: 'i_am_jesus',
        effect: { faith: 15 }
      }
    ]
  },

  'i_am_jesus': {
    title: 'I Am Jesus',
    location: 'Road to Damascus',
    scripture: 'Acts 9:5-6',
    background: 'light',
    journey: null,
    narrative: `The words hit you like a second blow. The very man whose followers you have been hunting — he is alive. And he is speaking to you.\n\nEvery argument you have ever made, every arrest, every letter — all of it collapses in an instant. You cannot see. You cannot speak. You can only listen.`,
    character: 'The Lord Jesus',
    dialogue: '"I am Jesus, whom you are persecuting. Now get up and go into the city, and you will be told what you must do."',
    choices: [
      {
        text: 'Rise from the ground and walk into Damascus — blind, fasting, and trembling',
        nextScene: 'three_days',
        effect: { faith: 20 }
      }
    ]
  },

  'three_days': {
    title: 'Three Days of Darkness',
    location: 'Damascus',
    scripture: 'Acts 9:9-12',
    background: 'room',
    journey: null,
    narrative: `Your men lead you by the hand into Damascus. The great persecutor, helpless as a child.\n\nFor three days you neither eat nor drink. You sit in darkness — not just physical, but the darkness of a man whose entire world has been turned upside down.\n\nYou pray. Hour after hour. You think of Stephen's face as he was stoned. You think of the families you separated. You think of the voice on the road: "Why do you persecute me?" To persecute the followers of Jesus... was to persecute Jesus himself.\n\nThen God shows you a vision: a man named Ananias will come and lay his hands on you.`,
    character: 'Saul (in prayer)',
    dialogue: '"Lord... I have been fighting against you. I did not know. I thought I was serving God. Have mercy on me."',
    choices: [
      {
        text: 'Wait in prayer for the man called Ananias',
        nextScene: 'ananias_comes',
        effect: { faith: 15 }
      }
    ]
  },

  'ananias_comes': {
    title: 'Brother Saul',
    location: 'Damascus',
    scripture: 'Acts 9:13-17',
    background: 'room',
    journey: null,
    narrative: `Footsteps. A knock. The door opens.\n\nThe man who enters has heard of you. He knows what you did in Jerusalem. He knows why you came to Damascus. God had to reassure him just to get him through the door.\n\nHe pauses beside you, and then places his hands on your shoulders. When he speaks, the first word he says changes everything.`,
    character: 'Ananias',
    dialogue: '"Brother Saul, the Lord — Jesus, who appeared to you on the road as you were coming here — has sent me so that you may see again and be filled with the Holy Spirit."',
    choices: [
      {
        text: 'Receive his ministry with a broken and open heart',
        nextScene: 'scales_fall',
        effect: { faith: 25 }
      }
    ]
  },

  'scales_fall': {
    title: 'Something Like Scales',
    location: 'Damascus',
    scripture: 'Acts 9:18-19',
    background: 'room',
    journey: null,
    narrative: `The moment Ananias's hands rest on you, something falls from your eyes — like scales, like crusts of dried blindness.\n\nLight floods in. You can see!\n\nYou can see Ananias's face — kind, cautious, brave. You can see the room. You can see your own hands, the hands that once dragged believers from their homes.\n\nWithout hesitation, you are baptized. You eat for the first time in three days. Strength returns to your body.\n\nYou are not the same man who rode out of Jerusalem. Saul the Persecutor is gone. Something — someone — new has begun.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Embrace your new life — spend time with the Damascus disciples',
        nextScene: 'preaching_damascus',
        effect: { faith: 20, health: 20 },
        nameChange: 'Paul',
        roleChange: 'Apostle · Tarsus'
      }
    ]
  },

  'preaching_damascus': {
    title: 'He Preached in the Synagogues',
    location: 'Damascus',
    scripture: 'Acts 9:20-22',
    background: 'synagogue',
    journey: null,
    narrative: `Without delay, you go to the synagogues of Damascus and begin proclaiming: "Jesus is the Son of God!"\n\nThe reaction is electric. People who knew you — who knew WHY you came to Damascus — are completely astonished.\n\n"Isn't this the man who caused havoc in Jerusalem? Isn't this the man who came here to arrest followers of the Way and take them as prisoners to the chief priests?"\n\nBut you only grow stronger. Your knowledge of the scriptures, honed over years as a Pharisee, now serves an entirely different master. You confound the Jewish leaders again and again, proving from their own texts that Jesus is the Messiah.`,
    character: 'Synagogue Elder',
    dialogue: '"You studied under Gamaliel himself. You are one of the finest minds in Israel. How can you say this crucified carpenter is the Messiah?"',
    choices: [
      {
        text: '"I have seen him with my own eyes. On the Damascus road. He is risen."',
        nextScene: 'basket_escape',
        effect: { faith: 15 }
      },
      {
        text: 'Open the scrolls and walk him through Isaiah, the Psalms, and Daniel',
        nextScene: 'basket_escape',
        effect: { faith: 20 }
      }
    ]
  },

  'basket_escape': {
    title: 'Escape in a Basket',
    location: 'Damascus',
    scripture: 'Acts 9:23-25',
    background: 'wall',
    journey: null,
    narrative: `After many days, the threat becomes real: the Jewish leaders conspire to kill you. They watch the city gates around the clock, day and night, waiting to seize you the moment you try to leave.\n\nBut the disciples find out. Under cover of darkness, they devise a plan that is equal parts ingenious and humbling — the great scholar Saul of Tarsus, lowered over the city wall inside a large wicker basket.\n\nYou grip the ropes and feel the cool night air as you descend. Below, the ground waits in darkness.`,
    character: 'Disciple',
    dialogue: '"Go quickly, brother. Go to Jerusalem. And may the Lord who stopped you on the road go with you now."',
    choices: [
      {
        text: 'Drop into the darkness and slip away into the night toward Jerusalem',
        nextScene: 'jerusalem_reception',
        effect: { health: -5 }
      }
    ]
  },

  'jerusalem_reception': {
    title: 'Trying to Join the Disciples',
    location: 'Jerusalem',
    scripture: 'Acts 9:26-28',
    background: 'default',
    journey: null,
    narrative: `You arrive in Jerusalem and try to join the community of believers. The response is what you feared: they want nothing to do with you.\n\n"Saul? The man who dragged believers from their homes? Who stood watching as Stephen was stoned? This is a trick."\n\nDoors close. Conversations stop. No one trusts you.\n\nThen one man steps forward. He has a reputation for encouragement — his real name is Joseph, but everyone calls him Barnabas: Son of Encouragement. He has heard your story and he believes it.`,
    character: 'Barnabas',
    dialogue: '"Brothers, listen to me. I have spoken with this man. On the road to Damascus he saw the Lord, and the Lord spoke to him. And in Damascus he preached boldly in the name of Jesus. I vouch for him."',
    choices: [
      {
        text: 'Accept Barnabas as your first true friend in the faith',
        nextScene: 'first_journey_call',
        effect: { faith: 15 },
        addCompanion: 'Barnabas'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  //  ACT 1 — FIRST MISSIONARY JOURNEY (Acts 13-14)
  // ══════════════════════════════════════════════════════════

  'first_journey_call': {
    title: 'Set Apart by the Spirit',
    location: 'Antioch, Syria',
    scripture: 'Acts 13:1-3',
    background: 'church',
    journey: 'First Missionary Journey',
    narrative: `Years have passed. You have been working in the church at Antioch alongside Barnabas and a team of prophets and teachers. It is a thriving, diverse community — Jews and Gentiles worshipping together.\n\nOne day, while the community is worshipping and fasting, the Holy Spirit speaks with unmistakable clarity. The room goes still. Everyone hears it.`,
    character: 'The Holy Spirit',
    dialogue: '"Set apart for me Barnabas and Saul for the work to which I have called them."',
    choices: [
      {
        text: 'Kneel to receive prayer, then rise and prepare to sail — the first journey begins',
        nextScene: 'cyprus_arrival',
        effect: { faith: 20 }
      }
    ]
  },

  'cyprus_arrival': {
    title: 'The Island of Cyprus',
    location: 'Cyprus',
    scripture: 'Acts 13:4-12',
    background: 'coast',
    journey: 'First Missionary Journey',
    narrative: `You and Barnabas sail first to Cyprus — Barnabas's home island. John Mark travels with you as your assistant. You make your way across the entire island, from Salamis in the east to Paphos in the west, preaching in the Jewish synagogues.\n\nIn Paphos, you meet a man who will test you: Elymas, a Jewish sorcerer and false prophet. He serves the Roman proconsul Sergius Paulus — a man of intelligence who has summoned you both because he genuinely wants to hear the Word of God.\n\nBut Elymas has other plans.`,
    character: 'Elymas the Sorcerer',
    dialogue: '"Do not listen to these wandering Jews, Proconsul. Their god is a convicted criminal. They would turn you away from Rome's wisdom and into their Jewish superstitions."',
    choices: [
      {
        text: 'Step forward and confront Elymas directly with the power of the Spirit',
        nextScene: 'elymas_blinded',
        effect: { faith: 15 }
      },
      {
        text: 'Ignore Elymas and appeal directly to Sergius Paulus',
        nextScene: 'elymas_blinded',
        effect: { faith: 10 }
      }
    ]
  },

  'elymas_blinded': {
    title: 'Child of the Devil',
    location: 'Paphos, Cyprus',
    scripture: 'Acts 13:9-12',
    background: 'court',
    journey: 'First Missionary Journey',
    narrative: `Filled with the Holy Spirit, you fix your eyes on Elymas. The courtroom goes quiet.`,
    character: 'Paul',
    dialogue: '"You are a child of the devil and an enemy of everything that is right! You are full of all kinds of deceit and trickery. Will you never stop perverting the right ways of the Lord? Now the hand of the Lord is against you. You are going to be blind — you will not even be able to see the light of the sun for a time."\n\nImmediately darkness falls over Elymas. He gropes around, desperately reaching for someone to lead him by the hand.',
    choices: [
      {
        text: 'Turn to Sergius Paulus and proclaim the gospel — he believes',
        nextScene: 'antioch_pisidia',
        effect: { faith: 20 },
        addItem: 'Letter from Sergius Paulus'
      }
    ]
  },

  'antioch_pisidia': {
    title: 'The Synagogue Sermon',
    location: 'Antioch in Pisidia',
    scripture: 'Acts 13:14-41',
    background: 'synagogue',
    journey: 'First Missionary Journey',
    narrative: `Sailing north, you arrive in Antioch of Pisidia. On the Sabbath, you enter the synagogue and take seats. After the reading from the Law and the Prophets, the synagogue rulers send a message your way.`,
    character: 'Synagogue Ruler',
    dialogue: '"Brothers, if you have any word of encouragement for the people, please speak."',
    choices: [
      {
        text: 'Stand and preach — from Abraham through David to the Resurrection of Jesus',
        nextScene: 'antioch_pisidia_2',
        effect: { faith: 25 }
      }
    ]
  },

  'antioch_pisidia_2': {
    title: 'The Whole City Gathers',
    location: 'Antioch in Pisidia',
    scripture: 'Acts 13:42-52',
    background: 'city',
    journey: 'First Missionary Journey',
    narrative: `Your sermon stirs the city. The people beg you to speak again the following Sabbath. When that day comes, nearly the entire city crowds around to hear the word of the Lord.\n\nBut the Jewish leaders are filled with jealousy at the crowds. They begin contradicting everything you say, hurling insults.\n\nYou and Barnabas answer them boldly.`,
    character: 'Paul and Barnabas',
    dialogue: '"We had to speak the word of God to you first. Since you reject it and do not consider yourselves worthy of eternal life, we now turn to the Gentiles! For this is what the Lord has commanded us: I have made you a light for the Gentiles, that you may bring salvation to the ends of the earth."',
    choices: [
      {
        text: 'The Gentiles rejoice — press on to Iconium despite Jewish opposition',
        nextScene: 'iconium',
        effect: { faith: 20 }
      }
    ]
  },

  'iconium': {
    title: 'Signs and Wonders in Iconium',
    location: 'Iconium',
    scripture: 'Acts 14:1-7',
    background: 'city',
    journey: 'First Missionary Journey',
    narrative: `In Iconium, you speak so effectively in the synagogue that a great number of both Jews and Gentiles believe. But those who refuse to believe stir up the other Gentiles and poison their minds against you.\n\nDespite the hostility, you stay a long time — speaking boldly for the Lord, who confirms your message by enabling miraculous signs and wonders.\n\nEventually the city is split. Half support you, half want to stone you. A plot forms: the leaders plan to seize and stone you both.`,
    character: 'Believer (whispering)',
    dialogue: '"Paul — the city leaders and a mob are gathering. They mean to stone you before nightfall. You must leave now."',
    choices: [
      {
        text: 'Slip out of the city and head for Lystra before the mob arrives',
        nextScene: 'lystra_healing',
        effect: { health: -5 }
      }
    ]
  },

  'lystra_healing': {
    title: 'The Lame Man of Lystra',
    location: 'Lystra',
    scripture: 'Acts 14:8-10',
    background: 'street',
    journey: 'First Missionary Journey',
    narrative: `In Lystra you preach in the open streets. As you speak, you notice a man sitting at the edge of the crowd — crippled in his feet, lame from birth, never having walked a single step in his life. He is listening to every word.\n\nYou look directly at him. Something in his eyes holds your gaze. You see faith. Real faith, the kind that reaches out before it can see what it's reaching for.\n\nYou feel the Spirit move.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: '"Stand up on your feet!" — shout it with full authority',
        nextScene: 'lystra_gods',
        effect: { faith: 25 }
      }
    ]
  },

  'lystra_gods': {
    title: 'The Gods Have Come Down!',
    location: 'Lystra',
    scripture: 'Acts 14:11-18',
    background: 'crowd',
    journey: 'First Missionary Journey',
    narrative: `The man leaps to his feet and begins to walk. The crowd erupts in noise.\n\nBut the reaction is not what you expected. The people shout in their native Lycaonian language — which you don't speak. A local believer translates in horror:\n\n"They're saying the gods have come down in human form! They're calling Barnabas Zeus — and you, Paul, they're calling Hermes because you do most of the talking!"\n\nThe priest of the temple of Zeus rushes up with bulls and flower garlands, preparing to offer a public sacrifice to you both.`,
    character: 'Paul',
    dialogue: '"Friends, friends — why are you doing this? We are only human, just like you! We are bringing you good news, telling you to turn from these worthless idols to the living God — who made the heaven, the earth, the sea, and everything in them!"',
    choices: [
      {
        text: 'Tear your clothes and rush into the crowd — stop the sacrifice at all costs',
        nextScene: 'lystra_stoning',
        effect: { faith: 20 }
      }
    ]
  },

  'lystra_stoning': {
    title: 'Stoned and Left for Dead',
    location: 'Lystra',
    scripture: 'Acts 14:19-20',
    background: 'street',
    journey: 'First Missionary Journey',
    narrative: `Then the tide turns — violently.\n\nJews from Antioch and Iconium have followed you to Lystra. The same crowd that wanted to worship you an hour ago is now persuaded to stone you.\n\nStones rain down. You fall. They drag your body outside the city walls and leave you for dead.\n\nThe disciples gather around you in a circle, afraid to hope.\n\nThen — you get up. Bruised. Bloodied. Breathing. You walk back into the city. The disciples stare in disbelief.\n\nThe next morning, you leave for Derbe. Barnabas by your side. One step at a time.`,
    character: 'Timothy (a young bystander)',
    dialogue: '"My mother and I thought he was dead. But he stood up. He walked back into the very city that stoned him. I have never seen anything like it."',
    choices: [
      {
        text: 'Rise and walk — nothing stops the word of God',
        nextScene: 'derbe',
        effect: { faith: 30, health: -30 }
      }
    ]
  },

  'derbe': {
    title: 'Many Disciples in Derbe',
    location: 'Derbe',
    scripture: 'Acts 14:20-28',
    background: 'city',
    journey: 'First Missionary Journey',
    narrative: `In Derbe, you preach the gospel and win a large number of disciples. The first journey is nearly complete.\n\nNow comes the decision. The safe route home would take you to the coast and then by sea back to Antioch — avoiding all the cities where people want you dead.\n\nBut you and Barnabas choose otherwise. You decide to return the way you came — through Lystra, Iconium, and Antioch of Pisidia — back through every city that stoned you, threatened you, and drove you out.\n\nYou need to strengthen the churches you planted there. You need to appoint elders. You need to prepare them for hard times ahead.`,
    character: 'Barnabas',
    dialogue: '"We must go back, Paul. These young believers need us. We cannot plant a church and then abandon it."',
    choices: [
      {
        text: 'Agree — return through the danger zones, strengthening and appointing elders in each church',
        nextScene: 'first_journey_complete',
        effect: { faith: 20, health: 10 },
        completeJourney: 'First Missionary Journey'
      }
    ]
  },

  'first_journey_complete': {
    title: 'The Report: A Door of Faith',
    location: 'Antioch, Syria',
    scripture: 'Acts 14:26-28',
    background: 'church',
    journey: 'First Missionary Journey',
    narrative: `You return to Antioch and gather the whole church together. The room fills — Jews and Gentiles, former pagans and former Pharisees, all straining to hear.\n\nYou report everything. The blinding of Elymas. The streets of Antioch in Pisidia. The lame man of Lystra. The stoning. Getting up. Coming back.\n\nAnd most of all: that God had "opened a door of faith to the Gentiles."\n\nThe first missionary journey is complete. Nearly 1,400 miles. Five cities. Beatings, stonings, and miraculous healings. And churches — real, living churches — that will outlast all of it.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Rest, report, and prepare for the Second Journey',
        nextScene: 'barnabas_split',
        effect: { faith: 15, health: 25 }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  //  ACT 2 — SECOND MISSIONARY JOURNEY (Acts 15-18)
  // ══════════════════════════════════════════════════════════

  'barnabas_split': {
    title: 'A Sharp Disagreement',
    location: 'Antioch, Syria',
    scripture: 'Acts 15:36-41',
    background: 'room',
    journey: 'Second Missionary Journey',
    narrative: `As you prepare for the second journey, Barnabas wants to bring his cousin John Mark again — the same John Mark who abandoned you mid-journey the first time, sailing home from Pamphylia when the going got hard.\n\nYou cannot agree to this. The mission is too important. You cannot afford unreliable members.\n\nThe disagreement is sharp. Painful. Barnabas is the man who stood up for you in Jerusalem when no one else would. But you hold firm.\n\nYou part ways. Barnabas takes John Mark and sails to Cyprus. You choose Silas — a prophet and Roman citizen like yourself — and head north by land.`,
    character: 'Barnabas',
    dialogue: '"John Mark is family, Paul. He made a mistake. Give him another chance. Isn\'t that what the gospel is about?"',
    choices: [
      {
        text: '"I cannot risk the mission. I will take Silas." — part ways, but in peace',
        nextScene: 'timothy_joins',
        effect: {},
        removeCompanion: 'Barnabas',
        addCompanion: 'Silas'
      }
    ]
  },

  'timothy_joins': {
    title: 'A Young Disciple Named Timothy',
    location: 'Syria and Cilicia',
    scripture: 'Acts 16:1-5',
    background: 'road',
    journey: 'Second Missionary Journey',
    narrative: `You travel through Syria and Cilicia, strengthening the churches. Then you arrive in Lystra — the very city where you were stoned.\n\nHere you meet a young disciple named Timothy. His mother Eunice is Jewish and a believer; his father is Greek. The believers in Lystra and Iconium all speak well of him.\n\nTimothy is young, but there is something about him. Faithful. Earnest. Ready to learn.\n\nYou invite him to join the team.`,
    character: 'Timothy',
    dialogue: '"I remember the day you were stoned, Paul. I was in the crowd. My mother and grandmother had taught me to pray, and I prayed for you. And you got up. That was the day I decided: I want to serve the God you serve."',
    choices: [
      {
        text: 'Welcome Timothy — he will become your most trusted companion',
        nextScene: 'macedonian_call',
        effect: { faith: 10 },
        addCompanion: 'Timothy'
      }
    ]
  },

  'macedonian_call': {
    title: 'The Macedonian Call',
    location: 'Troas',
    scripture: 'Acts 16:6-10',
    background: 'coast',
    journey: 'Second Missionary Journey',
    narrative: `The Holy Spirit has been closing doors all across Asia Minor. Phrygia. Galatia. The province of Asia. Every direction you try to go — blocked. You even try to enter Bithynia — the Spirit of Jesus will not allow it.\n\nFrustrated and uncertain, you make your way to Troas on the Aegean coast. The sea stretches west toward Europe.\n\nThat night, a vision comes to you in your sleep. A man standing on the far shore, beckoning.`,
    character: 'Man in the Vision',
    dialogue: '"Come over to Macedonia and help us."',
    choices: [
      {
        text: 'Wake Silas and Timothy immediately — God is calling us to Europe!',
        nextScene: 'philippi_lydia',
        effect: { faith: 25 }
      }
    ]
  },

  'philippi_lydia': {
    title: 'Lydia by the River',
    location: 'Philippi, Macedonia',
    scripture: 'Acts 16:11-15',
    background: 'river',
    journey: 'Second Missionary Journey',
    narrative: `You sail straight for Samothrace, then Neapolis, and on to Philippi — the leading city of Macedonia, a Roman colony.\n\nOn the Sabbath, you walk outside the city gate to the river, where you expect to find people gathered for prayer. You sit down and begin speaking to the women there.\n\nOne of them leans forward, listening with extraordinary intensity. Her name is Lydia — a businesswoman from Thyatira, a dealer in expensive purple cloth. She is already a worshipper of God.\n\nAs you speak, something happens inside her. The Lord opens her heart.`,
    character: 'Lydia',
    dialogue: '"Everything you have said about this Jesus — I believe it. Please — you and your companions must stay at my house. I insist."',
    choices: [
      {
        text: 'Accept her hospitality — baptize Lydia and her whole household',
        nextScene: 'philippi_slave_girl',
        effect: { faith: 20, health: 10 },
        addCompanion: 'Lydia'
      }
    ]
  },

  'philippi_slave_girl': {
    title: 'The Slave Girl',
    location: 'Philippi',
    scripture: 'Acts 16:16-22',
    background: 'street',
    journey: 'Second Missionary Journey',
    narrative: `Days pass. Each time you walk through the city to the place of prayer, the same thing happens: a slave girl follows you through the streets.\n\nShe has a spirit that enables her to predict the future, and her owners profit greatly from her "gift." Each day she shouts the same thing — loudly, persistently, everywhere you go:\n\n"These men are servants of the Most High God, who are telling you the way to be saved!"\n\nDay after day. Finally, you stop, turn, and face her.`,
    character: 'Paul',
    dialogue: '"In the name of Jesus Christ, I command you to come out of her!"',
    choices: [
      {
        text: 'The spirit leaves instantly — the girl is free. But her owners are furious.',
        nextScene: 'philippi_prison',
        effect: { faith: 25 }
      }
    ]
  },

  'philippi_prison': {
    title: 'Into the Inner Cell',
    location: 'Philippi Prison',
    scripture: 'Acts 16:22-24',
    background: 'prison',
    journey: 'Second Missionary Journey',
    narrative: `The slave girl's owners drag you and Silas before the magistrates in the marketplace.\n\n"These men are Jews! They are throwing our city into an uproar by advocating customs unlawful for Romans to practice!"\n\nThe crowd joins in the attack. The magistrates order you stripped and beaten. The rods fall across your back — hard, methodical, brutal. Then you are thrown into prison.\n\nThe jailer receives strict orders: guard them carefully. He puts you in the inner cell and fastens your feet in wooden stocks. Your back is raw. The stocks bite into your ankles. The stone floor is cold.\n\nWhat do you do?`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Begin to pray — and then to sing hymns to God. Let the other prisoners hear.',
        nextScene: 'midnight_earthquake',
        effect: { faith: 30, health: -25 }
      }
    ]
  },

  'midnight_earthquake': {
    title: 'The Midnight Earthquake',
    location: 'Philippi Prison',
    scripture: 'Acts 16:25-28',
    background: 'prison',
    journey: 'Second Missionary Journey',
    narrative: `About midnight, you and Silas are praying and singing hymns to God. The other prisoners are listening — a captive audience in the truest sense.\n\nThen — the ground shakes. A violent earthquake rocks the foundations of the prison. Every door flies open. Every chain falls loose.\n\nThe jailer jolts awake. He sees the open doors. He draws his sword — he knows what happens to jailers whose prisoners escape. Death is preferable to that disgrace.`,
    character: 'Paul',
    dialogue: '"Don\'t harm yourself! We are all here! Every one of us!"',
    choices: [
      {
        text: 'Shout out to the jailer through the darkness — stop him from taking his own life',
        nextScene: 'jailer_saved',
        effect: { faith: 20 }
      }
    ]
  },

  'jailer_saved': {
    title: 'What Must I Do to Be Saved?',
    location: 'Philippi',
    scripture: 'Acts 16:29-34',
    background: 'prison',
    journey: 'Second Missionary Journey',
    narrative: `The jailer calls for lights. He rushes into the inner cell and falls down before you and Silas — trembling.\n\nThen he asks the question that will echo through centuries of Christian history.`,
    character: 'The Jailer',
    dialogue: '"Sirs — what must I do to be saved?"',
    choices: [
      {
        text: '"Believe in the Lord Jesus, and you will be saved — you and your household."',
        nextScene: 'athens_areopagus',
        effect: { faith: 30, health: 15 },
        addItem: 'The Philippian Jailer\'s testimony'
      }
    ]
  },

  'athens_areopagus': {
    title: 'The Unknown God',
    location: 'Athens',
    scripture: 'Acts 17:16-34',
    background: 'athens',
    journey: 'Second Missionary Journey',
    narrative: `While waiting in Athens for Silas and Timothy to arrive, your spirit is deeply troubled within you — the city is absolutely full of idols. Thousands of them. Altars to every god imaginable.\n\nYou reason in the synagogue and debate daily in the marketplace. Epicurean and Stoic philosophers engage you. Some call you a "babbler" — someone who picks up random ideas like a bird picking up scraps.\n\nThey bring you to the Areopagus — the ancient rock where Athens's highest council meets — to explain this "new teaching."\n\nAs you walked through the city, one altar caught your eye. The inscription read: TO AN UNKNOWN GOD.\n\nYou stand before the council of Athens.`,
    character: 'Paul at the Areopagus',
    dialogue: '"People of Athens! I see that in every way you are very religious. I even found an altar with this inscription: TO AN UNKNOWN GOD. So you are ignorant of the very thing you worship — and this is what I am going to proclaim to you.\n\nThe God who made the world and everything in it is the Lord of heaven and earth and does not live in temples built by human hands... He has set a day when he will judge the world with justice by the man he has appointed. He has given proof of this to everyone by raising him from the dead."',
    choices: [
      {
        text: 'Finish the speech — some sneer, some want to hear more, and some believe',
        nextScene: 'corinth',
        effect: { faith: 25 }
      }
    ]
  },

  'corinth': {
    title: 'Eighteen Months in Corinth',
    location: 'Corinth',
    scripture: 'Acts 18:1-17',
    background: 'workshop',
    journey: 'Second Missionary Journey',
    narrative: `You arrive in Corinth — a bustling port city, wealthy and morally infamous even by Roman standards. It is not an easy place to plant a church.\n\nBut you meet a Jewish couple recently expelled from Rome: Aquila and his wife Priscilla. Like you, they are tentmakers. You move in and work with them, supporting yourself while you preach.\n\nOpposition rises. One night, the Lord speaks to you.`,
    character: 'The Lord (in a vision)',
    dialogue: '"Do not be afraid. Keep on speaking — do not be silent. For I am with you, and no one is going to attack and harm you, because I have many people in this city."',
    choices: [
      {
        text: 'Stay in Corinth for 18 months — teaching, building, and writing letters to the churches',
        nextScene: 'second_journey_complete',
        effect: { faith: 20, health: 15 },
        addCompanion: 'Aquila and Priscilla'
      }
    ]
  },

  'second_journey_complete': {
    title: 'Europe Has Heard the Gospel',
    location: 'Antioch, Syria',
    scripture: 'Acts 18:22',
    background: 'church',
    journey: 'Second Missionary Journey',
    narrative: `You sail from Corinth to Ephesus, briefly visit Jerusalem, and return to your home base in Antioch.\n\nThe second journey is complete. You have crossed from Asia into Europe — the first time the gospel has been preached on European soil. You have planted churches in Philippi, Thessalonica, Berea, Athens, and Corinth.\n\nYou have been beaten, imprisoned, driven from cities, and nearly stoned. You have seen a jailer baptized at midnight, a businesswoman turn her household into a church, and the philosophers of Athens hear about the resurrection.\n\nThe church in Philippi will become your greatest source of joy and support. The letters you will write to these churches will shape Christianity for the next two thousand years.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Return to Antioch — rest, then prepare for the Third Journey',
        nextScene: 'ephesus_hall',
        effect: { faith: 15, health: 20 },
        completeJourney: 'Second Missionary Journey'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  //  ACT 3 — THIRD MISSIONARY JOURNEY (Acts 18-21)
  // ══════════════════════════════════════════════════════════

  'ephesus_hall': {
    title: 'The Hall of Tyrannus',
    location: 'Ephesus',
    scripture: 'Acts 19:1-10',
    background: 'hall',
    journey: 'Third Missionary Journey',
    narrative: `You return to Ephesus — the great city on the Aegean coast, home of the famous temple of Artemis, one of the Seven Wonders of the ancient world.\n\nYou begin in the synagogue. But after three months, opposition hardens. You take a bold step: you rent the lecture hall of a philosopher named Tyrannus and teach there every day.\n\nFor two years — every single day — anyone who wants to come can hear you. Jews and Greeks from all across the province of Asia come through Ephesus and hear the word of the Lord.\n\nGod does extraordinary miracles here. Even handkerchiefs and aprons that touch you are carried to the sick — and they are healed.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Teach on — let the word of God spread through all of Asia',
        nextScene: 'sons_of_sceva',
        effect: { faith: 20, health: 10 }
      }
    ]
  },

  'sons_of_sceva': {
    title: 'The Sons of Sceva',
    location: 'Ephesus',
    scripture: 'Acts 19:11-20',
    background: 'street',
    journey: 'Third Missionary Journey',
    narrative: `News of the miraculous reaches you second-hand — with a grim sense of humor attached.\n\nSome Jewish exorcists in the city have started using your methods as a formula: "In the name of the Jesus whom Paul preaches, come out!"\n\nThe seven sons of a Jewish chief priest named Sceva tried this on a man with an evil spirit. The demon-possessed man turned on them.`,
    character: 'The Evil Spirit',
    dialogue: '"Jesus I know, and Paul I know about — but who are you?"\n\nThe demon-possessed man then attacked all seven of them with such violence that they fled from the house naked and bleeding.',
    choices: [
      {
        text: 'Hear the report — fear falls on Ephesus, and many who practiced sorcery burn their scrolls',
        nextScene: 'demetrius_riot',
        effect: { faith: 20 }
      }
    ]
  },

  'demetrius_riot': {
    title: 'The Riot of the Silversmiths',
    location: 'Ephesus',
    scripture: 'Acts 19:23-41',
    background: 'theater',
    journey: 'Third Missionary Journey',
    narrative: `A silversmith named Demetrius calls a meeting of all the craftsmen who make silver shrines and miniature temples of the goddess Artemis — a very profitable trade.\n\n"This Paul has turned away large numbers of people — not just in Ephesus but throughout practically the whole province of Asia! He says that man-made gods are no gods at all. Our business is in danger. And the great temple of Artemis herself will be discredited!"\n\nThe meeting erupts. The crowd floods into the streets, pulling your companions Gaius and Aristarchus into the huge open-air theater. The mob fills the theater and chants for two solid hours:`,
    character: 'The Ephesian Mob',
    dialogue: '"GREAT IS ARTEMIS OF THE EPHESIANS! GREAT IS ARTEMIS OF THE EPHESIANS!"',
    choices: [
      {
        text: 'Try to address the crowd — the disciples physically restrain you',
        nextScene: 'eutychus',
        effect: { faith: 15, health: -10 }
      },
      {
        text: 'Let the city clerk calm the crowd — he successfully defuses the riot',
        nextScene: 'eutychus',
        effect: { faith: 15 }
      }
    ]
  },

  'eutychus': {
    title: 'The Window at Troas',
    location: 'Troas',
    scripture: 'Acts 20:7-12',
    background: 'room',
    journey: 'Third Missionary Journey',
    narrative: `In Troas, you gather with the believers on the first day of the week to break bread together. You will be leaving tomorrow — possibly forever.\n\nYou begin to speak. And you keep speaking — because there is so much to say, and not enough time to say it. Midnight comes and goes.\n\nA young man named Eutychus is perched in a third-story window, trying to stay awake. He sinks deeper and deeper into sleep. And then — he falls.\n\nThree stories. When people reach him, he is dead.\n\nYou push through the crowd and go down to him.`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: 'Throw yourself on him and embrace him — just as Elijah and Elisha did',
        nextScene: 'eutychus_raised',
        effect: { faith: 25 }
      }
    ]
  },

  'eutychus_raised': {
    title: 'His Life Is in Him',
    location: 'Troas',
    scripture: 'Acts 20:10-12',
    background: 'room',
    journey: 'Third Missionary Journey',
    narrative: `You hold the boy in your arms. Then you look up at the crowd.`,
    character: 'Paul',
    dialogue: '"Don\'t be alarmed. His life is in him!"',
    choices: [
      {
        text: 'Go back upstairs, break bread, and keep talking until dawn — then depart',
        nextScene: 'voyage_to_rome',
        effect: { faith: 25, health: 5 },
        completeJourney: 'Third Missionary Journey'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  //  ACT 4 — VOYAGE TO ROME (Acts 21-28)
  // ══════════════════════════════════════════════════════════

  'voyage_to_rome': {
    title: 'Arrested in the Temple',
    location: 'Jerusalem',
    scripture: 'Acts 21:27-36',
    background: 'default',
    journey: 'Voyage to Rome',
    narrative: `Despite repeated warnings and prophetic words that chains and suffering await you in Jerusalem, you go. You cannot do otherwise.\n\n"I am ready not only to be bound, but also to die in Jerusalem for the name of the Lord Jesus."\n\nIn the temple, Jews from Asia recognize you. They seize you, drag you out of the temple, and the doors slam shut behind them. The crowd tries to kill you on the spot.\n\nRoman soldiers arrive just in time, running down from the barracks. They arrest you in chains.\n\nFrom the steps of the barracks, you ask permission to address the enraged crowd. In Aramaic — their own language — you begin to speak.`,
    character: 'Paul',
    dialogue: '"Brothers and fathers, listen now to my defense. I am a Jew, born in Tarsus of Cilicia, but brought up in this city. I studied under Gamaliel and was just as zealous for God as any of you are today. I persecuted the followers of this Way to their death... And then, on the road to Damascus, a light from heaven..."',
    choices: [
      {
        text: 'Tell the full story — the crowd listens until you mention the Gentiles',
        nextScene: 'before_agrippa',
        effect: { faith: 20 }
      }
    ]
  },

  'before_agrippa': {
    title: 'Before King Agrippa',
    location: 'Caesarea Maritima',
    scripture: 'Acts 26:1-29',
    background: 'throne_room',
    journey: 'Voyage to Rome',
    narrative: `After two years as a prisoner in Caesarea, you are brought before King Agrippa II and Governor Festus. The hearing is formal — a show of Roman power. Agrippa is the expert on Jewish customs. If anyone can determine your guilt or innocence, it is him.\n\n"You have permission to speak for yourself," says Agrippa.\n\nYou give your full defense — from your birth, through your time as a Pharisee, through the Damascus road, to your calling among the Gentiles.\n\nThen you turn the question directly on the king.`,
    character: 'Paul',
    dialogue: '"King Agrippa, do you believe the prophets? I know you do."\n\nAgrippa replied: "Do you think that in such a short time you can persuade me to be a Christian?"\n\n"Short time or long — I pray to God that not only you but all who are listening to me today may become what I am — except for these chains."',
    choices: [
      {
        text: 'Appeal to Caesar — sail for Rome',
        nextScene: 'the_storm',
        effect: { faith: 25 }
      }
    ]
  },

  'the_storm': {
    title: 'The Storm Euraquilo',
    location: 'Mediterranean Sea',
    scripture: 'Acts 27:14-26',
    background: 'sea',
    journey: 'Voyage to Rome',
    narrative: `You sail for Rome as a prisoner, accompanied by a centurion named Julius. The sailing is difficult from the start — it is late in the season.\n\nYou warn the crew not to sail from the harbor at Fair Havens. They ignore you.\n\nThen Euraquilo hits — a northeastern hurricane. The ship is caught and driven before it, unable to head into the wind. For fourteen days, no sun or stars are visible. All hope of survival is finally abandoned.\n\nYou stand before them all — passengers, soldiers, sailors, the centurion, 276 people total.`,
    character: 'Paul',
    dialogue: '"Men, you should have taken my advice. But now I urge you: keep up your courage, because not one of you will be lost — only the ship will be destroyed. Last night an angel of God stood beside me and said: \'Do not be afraid, Paul. You must stand trial before Caesar — and God has graciously given you the lives of all who sail with you.\' So keep up your courage. I have faith in God that it will happen just as he told me."',
    choices: [
      {
        text: 'Take command of the situation — distribute food, encourage the crew, prepare for impact',
        nextScene: 'shipwreck',
        effect: { faith: 25 }
      }
    ]
  },

  'shipwreck': {
    title: 'Run Aground at Malta',
    location: 'Malta',
    scripture: 'Acts 27:39 - 28:6',
    background: 'sea',
    journey: 'Voyage to Rome',
    narrative: `The ship strikes a sandbar. The bow lodges and the stern is broken to pieces by the waves. The soldiers plan to kill the prisoners — you among them — rather than risk any swimming to freedom.\n\nBut the centurion Julius, who has come to respect you, stops them. He orders everyone overboard. Some swim. Some grab planks.\n\nEvery single person makes it to shore. 276 people. Just as God promised.\n\nThe island is Malta. The islanders show extraordinary kindness — they light a fire in the rain and cold.\n\nYou gather brushwood and add it to the fire. A viper — driven out by the heat — fastens onto your hand.`,
    character: 'Maltese Islander',
    dialogue: '"This man must be a murderer! He survived the sea, but Justice will not let him live!"',
    choices: [
      {
        text: 'Shake the viper into the fire — feel nothing. No swelling. No death.',
        nextScene: 'malta_healing',
        effect: { faith: 30 }
      }
    ]
  },

  'malta_healing': {
    title: 'Healing on Malta',
    location: 'Malta',
    scripture: 'Acts 28:7-10',
    background: 'house',
    journey: 'Voyage to Rome',
    narrative: `The islanders wait. They are certain you will swell up or drop dead at any moment. Minutes pass. Then an hour. Nothing happens.\n\nThey change their minds completely: "He must be a god."\n\nPublius, the chief official of the island, welcomes you and hosts the entire shipwrecked party for three days. His father is lying in bed — suffering from fever and dysentery.\n\nYou visit him. You pray. You place your hands on him.\n\nHe is healed.\n\nWord spreads across the island. The rest of the sick people of Malta come to you — and every one of them is cured.\n\nThree months pass. A new ship is ready.`,
    character: 'Publius',
    dialogue: '"The sea could not kill him. The viper could not harm him. And now my father walks. Who is this man?"',
    choices: [
      {
        text: 'Spend three months ministering on Malta — then sail on toward Rome',
        nextScene: 'rome',
        effect: { faith: 20, health: 25 }
      }
    ]
  },

  'rome': {
    title: 'You Will See Rome',
    location: 'Rome',
    scripture: 'Acts 28:14-31',
    background: 'rome',
    journey: 'Voyage to Rome',
    narrative: `You arrive in Rome.\n\nThe brothers and sisters there have heard you are coming and travel miles out to meet you on the road. When you see them, you thank God and take courage.\n\nYou are placed under house arrest — a soldier chained to you at all times, but free to receive visitors, to write, to preach.\n\nFor two whole years, in your own rented house, you welcome everyone who comes. You write letters — to the Ephesians, to the Colossians, to Philemon, to the Philippians who have never stopped supporting you.\n\nAnd you preach. Boldly. Without hindrance. The very heart of the Roman Empire — and the gospel is being preached here.\n\nThe Book of Acts ends here. Not with a verdict. Not with a funeral. With a man on fire.`,
    character: 'Paul',
    dialogue: '"For two whole years Paul stayed there in his own rented house and welcomed all who came to see him. He proclaimed the kingdom of God and taught about the Lord Jesus Christ — with all boldness and without hindrance."',
    choices: [
      {
        text: 'The race is run. The faith is kept. Press on.',
        nextScene: 'game_complete',
        effect: { faith: 30 },
        completeJourney: 'Voyage to Rome'
      }
    ]
  },

  'game_complete': {
    title: 'I Have Kept the Faith',
    location: 'Rome',
    scripture: '2 Timothy 4:7',
    background: 'rome',
    journey: 'Voyage to Rome',
    narrative: `You have completed Paul's journeys.\n\nFrom the blinding light on the Damascus Road to the rented house in Rome. From breathing murderous threats to writing letters that will comfort believers for two thousand years. From holding the coats of those who stoned Stephen to being stoned yourself — and getting up.\n\nThree missionary journeys. Fourteen cities. Countless beatings, imprisonments, and shipwrecks. And in every one of them — a church. A community. A light.\n\nIn your own words, written from a prison cell late in life:\n\n"I have fought the good fight.\nI have finished the race.\nI have kept the faith."\n\n— 2 Timothy 4:7`,
    character: null,
    dialogue: null,
    choices: [
      {
        text: '✝  Play Again — Begin from Damascus',
        nextScene: 'intro',
        isRestart: true
      }
    ]
  }

};
