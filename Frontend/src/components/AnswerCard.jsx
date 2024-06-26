import React, { useRef, useState } from 'react'
import s, { layout } from '../style'
import { RiDeleteBin5Fill, RiHeart2Fill, RiHeart2Line } from "react-icons/ri";
import { BiCommentDetail, BiShare } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa'
import { FaImage, FaRegFaceLaugh } from "react-icons/fa6";
import { MdVerified } from 'react-icons/md'
import { GoDotFill } from 'react-icons/go'
import { FiEdit } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import { BsSendFill } from "react-icons/bs";
import beb from '../assets/profiles/bebnath.jpg'
import shan from '../assets/profiles/shanit.jpg'
import dibya from '../assets/profiles/dibya.jpeg'
import ray from '../assets/profiles/rayoti.jpg'
import rish from '../assets/profiles/rish.jpg'
import { ShareCard } from './modals/ShareCard'
import { MoreInfo } from './modals/MoreInfo'
import EmojiPicker from 'emoji-picker-react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const imageID = [
    {
        id: 1,
        path: beb,
    },
    {
        id: 2,
        path: shan,
    },
    {
        id: 3,
        path: ray,
    },
    {
        id: 4,
        path: dibya,
    },
    {
        id: 5,
        path: rish,
    },
]

export const AnswerCard = ({ question, answers, users, currentUser }) => {
    const initialState = {
        isFollow: false,
        isLike: false,
        isComment: false,
        isShare: false,
        isOptions: false,
        isSave: false,
        isSeeMore: false,
        isEmoji: false
    };

    const [state, setState] = useState(initialState);
    const { isFollow, isLike, isComment, isShare, isOptions, isSave, isSeeMore, isEmoji } = state;

    const [commentText, setCommentText] = useState("")
    const commentRef = useRef();

    const toggleState = (key) => {
        setState((prevState) => ({ ...prevState, [key]: !prevState[key] }));
    };

    const handleEmote = (event, emojiObject) => {
        setCommentText(commentRef.current.value + event.emoji)
    }

    const submitComment = () => {
        if (commentRef.current) {
            console.log(commentRef.current.value);
            let newComment={
                id: currentUser._id,
                text: commentRef.current.value
            }
            question.comments.push(newComment)
        }
        setCommentText("");
    }
    const deleteComment=(text)=>{
        const commentIndex=question.comments.findIndex((com)=>com.text===text)
        console.log(commentIndex);
        
        question.comments.splice(commentIndex,1)
        toggleState('isComment')
    }
    let answer = answers.filter((ans) => ans.question_id === question._id)

    // the answer with the most upvotes
    let mostUpvotedAnswer = {
        _id: 0,
        question_id: 0,
        user_id: 0,
        body: "",
        upvotes: 0,
        downvotes: 0,
        created_at: "",
        updated_at: ""
    };
    let maxUpvotes = -1;
    for (const ans of answer) {
        if (ans.upvotes > maxUpvotes) {
            mostUpvotedAnswer = ans;
            maxUpvotes = ans.upvotes;
        }
    }

    // Find the user data for the user who posted the most upvoted answer
    let answerUser = {
        _id: 0,
        name: "",
        email: "",
        password: "",
        pic: "",
        college: "",
        verified: false,
        department: "",
        year: 0,
        bio: "",
        followers: [],
        following: [],
        socials: [
            { linkedin: "" },
            { github: "" },
            { portfolio: "" },
            { twitter: "" }
        ],
        question_asked: [],
        answers_given: [],
        created_at: "",
        updated_at: ""
    }
    if (mostUpvotedAnswer.user_id !== 0) {
        answerUser = users.find((userData) => userData._id === mostUpvotedAnswer.user_id)
    }

    return (
        <div className={`${layout.ans}`}>

            <div className={`${layout.question}`}>
                <div className="w-11/12">
                    {(question.title.length > 100 && isSeeMore) ? (
                        <div className="">
                            {question.title.slice(0, 100)}
                            <button onClick={() => toggleState('isSeeMore')} className="text-rose-1 font-bold">...(more)</button>
                        </div>
                    ) : (
                        <div>
                            {question.title}
                        </div>
                    )}
                </div>
                <button>
                    <FiEdit className={`${s.icon5} `} />
                </button>
            </div>
            {answerUser._id !== 0 && (
                <>
                    <div className={`${layout.deets}`}>
                        <button>
                            <img src={imageID.find((image)=>answerUser._id===image.id).path} alt="profile" className="w-8 md:w-14 h-auto rounded-full"></img>
                        </button>
                        <div className={`${s.flexSS} flex-col w-full ml-2 md:ml-4`}>
                            <div className={`${s.flexBetween} w-full`}>
                                <div className={`${s.flexCenter}`}>
                                    <div className="text-sm md:text-xl text-rose-1 font-bold">
                                        {answerUser.name ? answerUser.name : ""}
                                    </div>
                                    {answerUser.verified && (
                                        <MdVerified className="text-rose-1 mx-1 text-base md:text-2xl" />
                                    )
                                    }
                                    {isFollow ? (
                                        <div className={`${s.flexCenter} ml-2 `}>
                                            <GoDotFill className="text-beige text-xs sm:text-base" />
                                            <button onClick={() => toggleState('isFollow')} className="text-beige text-xs sm:text-sm md:text-xl">
                                                Following
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`${s.flexCenter} ml-2 `}>
                                            <GoDotFill className="text-blue-1 text-xs sm:text-base" />
                                            <button onClick={() => toggleState('isFollow')} className="text-blue-1 text-xs sm:text-sm md:text-xl">
                                                Follow
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${s.flexBetween} w-full`}>
                                <div className="w-5/6 text-3xs md:text-sm text-beige font-bold">
                                    {answerUser.year}th year-{answerUser.department}
                                    <div className="text-rose-2 text-2xs md:text-base">{answerUser.college}</div>
                                </div>
                                <div className={`flex justify-end justify-items-end w-28 md:w-36`}>
                                    <GoDotFill className="text-beige text-xs sm:text-base" />
                                    <div className="text-beige text-3xs md:text-xs">
                                        {mostUpvotedAnswer.created_at ? formatDistanceToNow(new Date(mostUpvotedAnswer.created_at), { addSuffix: true }) : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${layout.answer}`}>
                        <div className={`${s.flexSS} w-full md:w-11/12`}>
                            <div className="text-beige">
                                {mostUpvotedAnswer.body !== null ?
                                    (mostUpvotedAnswer.body.length > 450 ? (
                                        <div className="py-4 px-2">
                                            {mostUpvotedAnswer.body.slice(0, 450)}
                                            <button className="text-rose-1 font-bold">...(more)</button>
                                        </div>
                                    ) : (
                                        <div className="py-4 px-2">
                                            {mostUpvotedAnswer.body}
                                        </div>
                                    ))
                                    : ("")
                                }
                            </div>
                        </div>
                        <div className={`${layout.skillset}`}>
                            {answerUser.skills.map((skill, index) => (
                                <div key={index} className={`${s.skills}`}>{skill}</div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className={`${layout.likes}`}>
                <div className={`${s.flexCenter}`}>
                    <button onClick={() => toggleState('isLike')}>
                        {isLike ? (
                            <RiHeart2Fill className={`${s.icon4}`} />
                        ) : (
                            <RiHeart2Line className={`${s.icon4}`} />
                        )}
                    </button>
                    <div className={`${s.likes_num}`}>
                        {question.likes}
                    </div>
                    <button onClick={() => {
                        toggleState('isComment')
                        setState((prevState) => ({ ...prevState, showEmoji: false }))
                    }}>
                        <BiCommentDetail className={`${s.icon4}`} />
                    </button>
                    <div className={`${s.likes_num}`}>
                        {question.comments.length}
                    </div>

                    <FaEye className={`${s.icon4}`} />

                    <div className={`${s.likes_num}`}>
                        {question.views}
                    </div>
                    <button onClick={() => toggleState('isShare')}>
                        <BiShare className={`${s.icon4}`} />
                    </button>
                    <div className={`${s.likes_num}`}>
                        {question.shared}
                    </div>
                </div>
                <button onClick={() => toggleState('isOptions')}>
                    <SlOptionsVertical className={`${s.icon6}`} />
                </button>
            </div>
            {isComment && (
                <div className={`${layout.comments}`}>
                    <div className={`${layout.myComments}`}>
                        <img src={beb} alt="myicon" className={`${s.profilePic}`} />
                        <div className={`${layout.comments_button}`}>
                            <input ref={commentRef} placeholder="Add a comment..." type="text" value={commentText} onChange={e => setCommentText(e.target.value)} className={`${s.comments_text}`} />
                            <button onClick={() => toggleState('isEmoji')}>
                                <FaRegFaceLaugh className={`${s.icon7}`} />
                            </button>
                            <button>
                                <FaImage className={`${s.icon7}`} />
                            </button>
                            {(commentText.length !== 0) &&
                                <button onClick={submitComment}>
                                    <BsSendFill className={`${s.icon7}`} />
                                </button>
                            }
                        </div>
                    </div>
                    {/* comment  */}
                    {question.comments.map((com,i) => (
                        <div key={i} className={`${s.flexStart} w-full`}>
                            <img src={imageID.find((image) => image.id === com.id).path} alt="profile" className={`${s.commentPic}`} />
                            <div  className={`${layout.commentList}`}>
                                <div className={`${s.flexBetween} w-full`}>
                                    <div className={`${s.flexStart} flex-col`}>
                                        <div className={`${s.flexCenter}`}>
                                            <div className="text-xs md:text-sm text-rose-1 font-bold">
                                                {users.find((user)=>com.id===user._id).name}
                                            </div>
                                            {users.find((user)=>com.id===user._id).verified && (
                                                <MdVerified className="text-rose-1 mx-1 text-xs md:text-lg" />
                                            )
                                            }
                                        </div>
                                        <div className="text-2xs md:text-xs text-beige">
                                            {users.find((user)=>com.id===user._id).bio}
                                        </div>
                                    </div>
                                    {(com.id===currentUser._id) && 
                                        <RiDeleteBin5Fill onClick={()=>deleteComment(com.text)} className={`${s.icon7}`} />
                                    }
                                </div>                        
                                <div className="text-sm md:text-base py-2">{com.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isEmoji &&
                <div className="absolute">
                    <EmojiPicker onEmojiClick={handleEmote} width="200" theme='dark' className={`${s.emoji}`} />
                </div>
            }

            {isShare && (
                <ShareCard sharepost={() => toggleState('isShare')} />
            )}
            {isOptions && (
                <MoreInfo handleOptions={() => toggleState('isOptions')} handleSave={() => toggleState('save')} save={isSave} />
            )}
        </div>
    )
}
