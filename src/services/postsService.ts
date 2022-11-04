import bcrypt from "bcrypt";
import { database } from "../dataSource";
import { errorConstructor } from "../middlewares/errorConstructor";
import { Posts } from "../entities/Posts";
import { User } from "../entities/User";
import { Weather } from "../entities/Weather";

const createPosts = async (
  title: string,
  content: string,
  password: string,
  userId: number
) => {
  const userRepository = database.getRepository(User);
  const checkUserId = await userRepository.findOneBy({ id: userId });
  if (!checkUserId) {
    throw new errorConstructor(400, "없는 회원 아이디입니다.");
  }

  let currentWeather = "";
  await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=Korea&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => (currentWeather = data.current.condition.text));
  const weatherRepository = database.getRepository(Weather);
  const checkWeather = await weatherRepository.findOneBy({
    name: currentWeather,
  });
  const weather = new Weather();
  if (!checkWeather) {
    weather.name = currentWeather;
    await database.manager.save(weather);
  }
  const getWeather = await weatherRepository.findOneBy({
    name: currentWeather,
  });
  const weatherId = getWeather?.id;
  if (!weatherId) {
    throw new errorConstructor(400, "잘못된 접근입니다.");
  }
  weather.id = weatherId;

  const saltRound = 8;
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User();
  user.id = userId;
  const posts = new Posts();
  posts.title = title;
  posts.content = content;
  posts.password = hashedPassword;
  posts.user = user;
  posts.weather = weather;
  await database.manager.save(posts);
};

const updatePosts = async (
  postsId: number,
  title: string,
  content: string,
  password: string
) => {
  const postsRepository = database.getRepository(Posts);
  const postsUpdate = await postsRepository.findOneBy({ id: postsId });
  if (!postsUpdate) {
    throw new errorConstructor(400, "틀린 게시물 아이디입니다.");
  }
  const checkPassword = await bcrypt.compare(password, postsUpdate.password);
  if (!checkPassword) {
    throw new errorConstructor(400, "틀린 비밀번호입니다.");
  }
  if (!title) {
    title = postsUpdate.title;
  }
  if (!content) {
    content = postsUpdate.content;
  }
  postsUpdate.title = title;
  postsUpdate.content = content;
  await postsRepository.save(postsUpdate);
};

const deletePosts = async (postsId: number, password: string) => {
  const postsRepository = database.getRepository(Posts);
  const postsDelete = await postsRepository.findOneBy({ id: postsId });
  if (!postsDelete) {
    throw new errorConstructor(400, "틀린 게시물 아이디입니다.");
  }
  const checkPassword = await bcrypt.compare(password, postsDelete.password);
  if (!checkPassword) {
    throw new errorConstructor(400, "틀린 비밀번호입니다.");
  }
  await postsRepository.softDelete({ id: postsId });
};

const getPostsList = async (pageNo: number) => {
  const postsRepository = database.getRepository(Posts);
  if (!pageNo) {
    const allPostsList = await postsRepository.find({
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
      relations: ["user", "weather"],
      order: { id: "DESC" },
    });
    return allPostsList;
  }
  const limit = 20;
  const skip = pageNo * limit - limit;
  const postsList = await postsRepository.find({
    select: {
      id: true,
      title: true,
      content: true,
      created_at: true,
      updated_at: true,
    },
    relations: ["user", "weather"],
    order: { id: "DESC" },
    take: limit,
    skip,
  });
  return postsList;
};

export { createPosts, updatePosts, deletePosts, getPostsList };
