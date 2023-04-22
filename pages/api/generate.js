import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const animal = req.body.animal || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    // const completion = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   // prompt: generatePrompt(animal),
    //   messages: [{role: "user", content: "Hello world"}],
    //   // temperature: 0.6,
    // });

    // res.status(200).json({ result: completion.data.choices[0].text });
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesArray(animal),
    });
    // console.log(completion.data.choices[0].message.content);
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

function messagesArray(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return [
    {
      role: "system",
      content: `Hello, I want you to act as a prompt generator for text to image programs like Dall-E, Midjourney and Stable Diffusion.`,
    },

    {
      role: "assistant",
      content: `A prompt is made up of the following parameters:
      - Subject, such as a woman in a red dress, a cyborg cat or a wizard with white hair
      - Medium, such as cinematic still, hyper detailed rendering, ultra realistic illustration
      - Style, such as photorealistic, comic art, model shoot style
      - Artist, such as Greg Rutkowski, Ilya Kushinov, Makoto Shinkai
      - Movie, such as Dune, Moonlight, Interstellar
      - Website, such as Artstation, DeviantArt, CGSociety
      - Render engine/Photo quality, such as 8K, unreal engine, octane
      - Camera shot type, such as portrait, wide angle lens, over the shoulder shot
      - Color, such as iridescent gold, dark azure, pastel colors
      - Lighting, such as cinematic lighting, 2 tone lighting, sunset
      - Mood, such as dramatic, intense, warm
      - Camera model, such as ferrania p30, canon eos 5d mark iv, hasselblad h6d-400c

      A prompt may not contain all the parameters. However subject, medium, style, camera shot type, color, lighting and mood are important and will be in the prompt.

      A prompt is a continuous sentence. Examples include:

      - 8K, top down shot of Ana de Armas as a cyborg in a futuristic sci-fi setting, high detailed skin, pretty face, expressive eyes, highly detailed, photorealistic, cyberpunk, intricate detail in clothing and accessories, metal prosthetics, walking away from the camera, bold and vibrant, strong contrast, dramatic lighting effects, by artist Simon Stalenhag, by artist Ruan Jia, night, detailed background of futuristic city, neon lights, billboards, people all around
      - a digital painting of a pretty female wizard with beautiful piercing eyes in a black coat lifting up one hand to weld a ball of fire, blue eyes, highly detailed, photorealistic, full body, highly detailed, by Artgerm, by Greg Rutkowski, dramatic, windy, unreal engine, artstation hd
      - Beautiful cyborg princess looking out over her lands from a tall tower, league of legends, long legs, belly dancer, high heels, intricate detail, cyberpunk Japan, futuristic, clean sharp focus
      - a painting of a woman with colorful hair, fantasy game spell icon, splashes of liquid, computer game art, hyperdetailed colourful, fantasy colours, avatar image, strong blue and orange colors, beautiful avatar pictures, body painted with black fluid, digital art, rich colourful
      - a lifelike illustration of Katheryn Winnick as a vampire, wearing a black cloak, detailed face, by artist alex ross, artstation style, trending on instagram, cool lighting, dark colors, realistic fabric and metal effects

      It is important to note that prompts only describe the content of each parameter and do not include the name of the parameter itself.
        `,
    },
    //     {
    //       role: "assistant",
    //       content: `A prompt is a continuous sentence. Examples include:
    //       - 8K, top down shot of Ana de Armas as a cyborg in a futuristic sci-fi setting, high detailed skin, pretty face, expressive eyes, highly detailed, photorealistic, cyberpunk, intricate detail in clothing and accessories, metal prosthetics, walking away from the camera, bold and vibrant, strong contrast, dramatic lighting effects, by artist Simon Stalenhag, by artist Ruan Jia, night, detailed background of futuristic city, neon lights, billboards, people all around
    // - a digital painting of a pretty female wizard with beautiful piercing eyes in a black coat lifting up one hand to weld a ball of fire, blue eyes, highly detailed, photorealistic, full body, highly detailed, by Artgerm, by Greg Rutkowski, dramatic, windy, unreal engine, artstation hd
    // - Beautiful cyborg princess looking out over her lands from a tall tower, league of legends, long legs, belly dancer, high heels, intricate detail, cyberpunk Japan, futuristic, clean sharp focus
    // - Extreme close up of an eye that is the mirror of the nostalgic moments, nostalgia expression, sad emotion, tears, made with imagination, detailed, photography, 8k, printed on Moab Entrada Bright White Rag 300gsm, Leica M6 TTL, Leica 75mm 2.0 Summicron-M ASPH, Cinestill 800T
    //         `,
    //     },
    {
      role: "user",
      content: `Suggest one prompt based on the subject: ${animal}.`,
    },
  ];
}
// function messagesArray(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return [
//     { role: "system", content: "Hello, you are a creative writer." },

//     {
//       role: "assistant",
//       content: `Examples of superhero animal names include:
//         Animal: Cat
//         Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
//         Animal: Dog
//         Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
//         `,
//     },
//     {
//       role: "user",
//       content: `Suggest three names for a ${animal} that is a superhero.`,
//     },
//   ];
// }
