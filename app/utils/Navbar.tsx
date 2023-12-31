"use client";

import { useEffect, useState } from "react";
import { RiCompass3Line } from "react-icons/ri";
import { AiOutlineCamera } from "react-icons/ai";
import {
  BsEnvelope,
  BsPencilSquare,
  BsBookmark,
  BsHouse,
  BsBell,
  BsSearch,
} from "react-icons/bs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Theme } from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
import { GoSmiley } from "react-icons/go";
import { RxMoon, RxSun } from "react-icons/rx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  username: string;
  avatar: string;
  displayname: string;
  _count: {
    notifications: number;
  };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState<File | string>("");
  const { data: session } = useSession();
  const [post, setPost] = useState("");
  const { theme, setTheme } = useTheme();
  const notify = () =>
    toast({
      title: "Posted!",
      description: "Your post has been posted.",
    });

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
        });
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 280) {
      e.preventDefault();
      setPost(post.slice(0, 280));
      return false;
    }
    setPost(e.target.value);
  };

  const makePost = async () => {
    const form = new FormData();
    if (image) form.append("image", image);
    form.append("content", post);
    setIsOpen(false);
    fetch("/api/post", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        setPost("");
        notify();
        setIsOpen(false);
      });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setPost((post) => post + emojiObject.emoji);
  };

  return (
    <>
      <div className="sticky inset-0 hidden h-screen flex-col p-4 md:flex">
        {user && (
          <>
            <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
              <Link href="/dashboard" className="flex flex-row  items-end">
                <BsHouse className="h-7 w-7   " />
                <p className="text-lg">Dashboard</p>
              </Link>
            </div>

            <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900">
              <Link href="/explore" className="flex flex-row  items-end">
                <RiCompass3Line className=" h-7 w-7  " />
                <p className="text-lg">Explore</p>
              </Link>
            </div>

            <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200  dark:hover:bg-slate-900">
              <Link
                href={`/@${user.username}`}
                className="flex flex-row items-end"
              >
                <FaRegUserCircle className="h-7 w-7   " />
                <p className=" text-lg">Profile</p>
              </Link>
            </div>

            <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200  dark:hover:bg-slate-900">
              <Link href="/settings" className="flex flex-row items-end">
                <BiCog className=" h-7 w-7  " />
                <p className="text-lg  ">Settings</p>
              </Link>
            </div>

            <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
              <Link href="/notifications" className="flex flex-row">
                <BsBell className="h-7 w-7   " />
                {user._count.notifications > 0 && (
                  <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                    {user._count.notifications}
                  </div>
                )}
                <p className="text-lg  ">Notifications</p>
              </Link>
            </div>

            <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
              <Link href="/bookmarks" className="flex flex-row items-end">
                <BsBookmark className=" h-7 w-7 " />
                <p className="text-lg  ">Bookmarks</p>
              </Link>
            </div>

            <div className="relative mt-4 p-4  hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
              <Link href="/directs" className="flex flex-row items-end">
                <BsEnvelope className=" h-7 w-7  " />
                <p className="text-lg  ">Directs</p>
              </Link>
            </div>

            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <DialogTrigger className="w-full">
                <div
                  className="mt-4 flex cursor-pointer flex-row items-end p-4  hover:rounded-xl  hover:bg-slate-200  dark:hover:bg-slate-900 "
                  onClick={openModal}
                >
                  <BsPencilSquare className=" h-7 w-7" />{" "}
                  <p className="text-lg">New Post</p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-slate-100 dark:bg-slate-950">
                <div className="flex flex-row items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center">
                      <div className="flex flex-row items-center">
                        <DropdownMenuLabel>
                          <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-800">
                            <GoSmiley className="h-4 w-4" />
                          </div>
                        </DropdownMenuLabel>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.DARK}
                        emojiStyle={EmojiStyle.TWITTER}
                      />
                      <DropdownMenuArrow />
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <label htmlFor="image">
                    <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-800">
                      <AiOutlineCamera className="h-4 w-4 cursor-pointer" />
                    </div>
                  </label>
                  <Input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="hidden w-full cursor-pointer border border-gray-700 bg-gray-50 file:border file:border-none file:bg-gray-800 file:text-white dark:bg-gray-700"
                  />
                </div>

                <div className="mt-2 w-full">
                  <Textarea
                    id="content"
                    name="content"
                    rows={4}
                    value={post}
                    onChange={handleChange}
                    placeholder="What is happening?"
                    className="w-full resize-none border-none bg-slate-200  outline-none focus:border-none focus:outline-none focus:ring-0 dark:bg-slate-800 "
                  />
                </div>

                <div className="mt-4 flex w-full flex-col items-center justify-center">
                  {post.replaceAll(" ", "").length === 0 ? (
                    <Button
                      type="button"
                      className=" m-4 my-1 w-full"
                      onClick={makePost}
                      disabled
                    >
                      Post
                    </Button>
                  ) : (
                    <button
                      type="button"
                      className=" m-4 my-1 w-full"
                      onClick={makePost}
                    >
                      Post
                    </button>
                  )}
                  {280 - post.length > 20 ? (
                    <p className="text-teal-400"> {280 - post.length}</p>
                  ) : (
                    <p className="text-rose-400"> {280 - post.length}</p>
                  )}

                  {preview && (
                    <Image src={preview} alt={"lol"} height={100} width={100} />
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="mt-4 flex flex-row items-center p-4"
                asChild
              >
                <div>
                  <Image
                    src={user.avatar}
                    alt=""
                    height={30}
                    width={30}
                    className="mr-1 rounded-full"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold  ">
                      {user.displayname ? user.displayname : user.username}
                    </p>
                    <p className="text-slate-700 dark:text-slate-500">
                      @{user.username}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer  "
                >
                  {theme === "dark" ? (
                    <RxMoon className="mx-1 h-4 w-4" />
                  ) : (
                    <RxSun className="mx-1 h-4 w-4" />
                  )}
                  Toggle Dark Mode
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black dark:bg-white" />
                <DropdownMenuItem
                  onSelect={() => signOut()}
                  className="cursor-pointer  "
                >
                  <BiLogOut className="mx-1 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      <div className="absolute bottom-0 flex w-full flex-row p-4 md:hidden">
        {user && (
          <Sheet>
            <div className="flex w-full flex-row justify-between">
              <SheetTrigger>
                <HamburgerMenuIcon className="h-7 w-7  " />
              </SheetTrigger>
              <Link href="/search">
                <BsSearch className="h-7 w-7  " />
              </Link>
              <Link href="/dashboard">
                <BsHouse className="h-7 w-7  " />
              </Link>
              <Link href={`/@${user.username}`}>
                <FaRegUserCircle className="h-7 w-7   " />
              </Link>
              <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <DialogTrigger>
                  <BsPencilSquare className="h-7 w-7  " />{" "}
                </DialogTrigger>
                <DialogContent className="bg-slate-100 dark:bg-slate-950">
                  <div className="flex flex-row items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex flex-row items-center">
                        <div className="flex flex-row items-center">
                          <DropdownMenuLabel>
                            <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-800">
                              <GoSmiley className="h-4 w-4" />
                            </div>
                          </DropdownMenuLabel>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          theme={Theme.DARK}
                          emojiStyle={EmojiStyle.TWITTER}
                        />
                        <DropdownMenuArrow />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <label htmlFor="image">
                      <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-800">
                        <AiOutlineCamera className="h-4 w-4 cursor-pointer" />
                      </div>
                    </label>
                    <Input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden w-full cursor-pointer border border-gray-700 bg-gray-50 file:border file:border-none file:bg-gray-800 file:text-white dark:bg-gray-700"
                    />
                  </div>

                  <div className="mt-2 w-full">
                    <Textarea
                      id="content"
                      name="content"
                      rows={4}
                      value={post}
                      onChange={handleChange}
                      placeholder="What is happening?"
                      className="w-full resize-none border-none bg-slate-200  outline-none focus:border-none focus:outline-none focus:ring-0 dark:bg-slate-800 "
                    />
                  </div>

                  <div className="mt-4 flex w-full flex-col items-center justify-center">
                    {post.replaceAll(" ", "").length === 0 ? (
                      <Button
                        type="button"
                        className=" m-4 my-1 w-full"
                        onClick={makePost}
                        disabled
                      >
                        Post
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className=" m-4 my-1 w-full"
                        onClick={makePost}
                      >
                        Post
                      </Button>
                    )}
                    {280 - post.length > 20 ? (
                      <p className="text-teal-400"> {280 - post.length}</p>
                    ) : (
                      <p className="text-rose-400"> {280 - post.length}</p>
                    )}

                    {preview && (
                      <Image
                        src={preview}
                        alt={"lol"}
                        height={100}
                        width={100}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>{" "}
            </div>

            <SheetContent
              className="bg-slate-200 dark:bg-slate-950"
              side="left"
            >
              {" "}
              <>
                <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/dashboard" className="flex flex-row  items-end">
                    <BsHouse className="h-7 w-7   " />
                    <p className="text-lg  ">Dashboard</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/search" className="flex flex-row  items-end">
                    <RiCompass3Line className=" h-7 w-7  " />
                    <p className="text-lg   ">Search</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/explore" className="flex flex-row  items-end">
                    <RiCompass3Line className=" h-7 w-7  " />
                    <p className="text-lg   ">Explore</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200  dark:hover:bg-slate-900">
                  <Link
                    href={`/@${user.username}`}
                    className="flex flex-row items-end"
                  >
                    <FaRegUserCircle className="h-7 w-7   " />
                    <p className=" text-lg  ">Profile</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl hover:bg-slate-200  dark:hover:bg-slate-900">
                  <Link href="/settings" className="flex flex-row items-end">
                    <BiCog className=" h-7 w-7  " />
                    <p className="text-lg   ">Settings</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/notifications" className="flex flex-row">
                    <BsBell className="h-7 w-7   " />
                    {user._count.notifications > 0 && (
                      <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                        {user._count.notifications}
                      </div>
                    )}
                    <p className="text-lg   ">Notifications</p>
                  </Link>
                </div>

                <div className="mt-4 p-4 hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/bookmarks" className="flex flex-row items-end">
                    <BsBookmark className=" h-7 w-7  " />
                    <p className="text-lg   ">Bookmarks</p>
                  </Link>
                </div>

                <div className="relative mt-4 p-4  hover:rounded-xl  hover:bg-slate-200 dark:hover:bg-slate-900">
                  <Link href="/directs" className="flex flex-row items-end">
                    <BsEnvelope className=" h-7 w-7  " />
                    <p className="text-lg   ">Directs</p>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="mt-4 flex flex-row items-center p-4"
                    asChild
                  >
                    <div>
                      <Image
                        src={user.avatar}
                        alt=""
                        height={30}
                        width={30}
                        className="mr-1 rounded-full"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-lg font-bold  ">
                          {user.displayname ? user.displayname : user.username}
                        </p>
                        <p className="text-slate-700 dark:text-slate-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="cursor-pointer  "
                    >
                      {theme === "dark" ? (
                        <RxMoon className="mx-1 h-4 w-4" />
                      ) : (
                        <RxSun className="mx-1 h-4 w-4" />
                      )}
                      Toggle Dark Mode
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black dark:bg-white" />
                    <DropdownMenuItem
                      onSelect={() => signOut()}
                      className="cursor-pointer  "
                    >
                      <BiLogOut className="mx-1 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </>
  );
}
