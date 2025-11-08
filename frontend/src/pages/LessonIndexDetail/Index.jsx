import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBook,
  FaBookmark,
  FaBullseye,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaCube,
  FaFileAlt,
  FaGraduationCap,
  FaIdCard,
  FaImage,
  FaLayerGroup,
  FaList,
  FaPlayCircle,
  FaQuestionCircle,
  FaTag
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getIndex } from "../../api/books";
import BlockCard from "../book/components/BookLessonDetail/components/BlockCard/BlockCard";
import FlashCardItem from "../book/components/BookLessonDetail/components/BlockCard/components/CardManager/components/FlashCardItem/FlashCardItem";
import styles from './styles.module.css';

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessonIndex, setLessonIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [activeTab, setActiveTab] = useState('book');

  useEffect(() => {
    const fetchLessonIndex = async () => {
      try {
        const data = await getIndex(id);
        setLessonIndex(data);
      } catch (err) {
        setError(err.message || "فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonIndex();
  }, [id]);

  const toggleLessonBlocks = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const toggleAllLessons = (expand) => {
    const newState = {};

    if (activeTab === 'book') {
      lessonIndex?.book_lesson?.forEach(lesson => {
        newState[lesson.id] = expand;
      });
    } else if (lessonIndex?.lesson?.lesson_block) {
      lessonIndex.lesson.lesson_block.forEach(block => {
        newState[block.id] = expand;
      });
    }

    setExpandedLessons(newState);
  };

  const renderImage = (imageUrl, alt = "صورة المحتوى") => {
    if (!imageUrl) return null;

    return (
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={alt}
          className={styles.contentImage}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>جاري التحميل...</div>;
  if (error) return <div className={styles.error}>خطأ: {error}</div>;
  if (!lessonIndex) return <div className={styles.noData}>لا توجد بيانات</div>;

  return (
    <div className={styles.container}>
      {/* الهيدر */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaBook /> فهرس الدرس: {lessonIndex.title}
        </h1>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FaArrowRight /> العودة
        </button>
      </div>

      {/* معلومات التصنيف */}
      <div className={styles.metaTags}>
        <span className={styles.metaTag}><FaLayerGroup /> {lessonIndex.stage_title}</span>
        <span className={styles.metaTag}><FaTag /> {lessonIndex.grade_title}</span>
        <span className={styles.metaTag}><FaFileAlt /> {lessonIndex.program_title}</span>
        <span className={styles.metaTag}><FaClipboardList /> {lessonIndex.subject_title}</span>
      </div>

      {/* نظام التبويب */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'book' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('book')}
          >
            <FaBook className={styles.tabIcon} />
            <span>دروس الكتاب</span>
            <span className={styles.badge}>{lessonIndex.book_lesson?.length ?? 0}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'lesson' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            <FaGraduationCap className={styles.tabIcon} />
            <span>محتوى الدرس</span>
            <span className={styles.badge}>{lessonIndex.lesson?.lesson_block?.length ?? 0}</span>
          </button>
        </div>
      </div>

      {/* محتوى التبويب النشط */}
      {activeTab === 'book' ? (
        <div className={styles.section}>
          <div className={styles.lessonHeader}>
            <h2 className={styles.sectionTitle}>
              دروس الكتاب ({lessonIndex.book_lesson?.length ?? 0})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={styles.toggleButton}
                onClick={() => toggleAllLessons(true)}
                disabled={!lessonIndex.book_lesson?.length}
              >
                <span>توسيع الكل</span>
                <FaChevronDown />
              </button>
              <button
                className={styles.toggleButton}
                onClick={() => toggleAllLessons(false)}
                disabled={!lessonIndex.book_lesson?.length}
              >
                <span>طي الكل</span>
                <FaChevronUp />
              </button>
            </div>
          </div>

          {lessonIndex.book_lesson?.length > 0 ? (
            lessonIndex.book_lesson.map((bookLesson) => (
              <div key={bookLesson.id} className={styles.bookLesson}>
                <div className={styles.lessonDetails}>
                  <div className={styles.lessonHeader}>
                    <h3 className={styles.lessonTitle}>{bookLesson.title}</h3>
                    <button
                      className={styles.toggleButton}
                      onClick={() => toggleLessonBlocks(bookLesson.id)}
                    >
                      {expandedLessons[bookLesson.id] ? (
                        <>
                          <span>إخفاء البلوكات</span>
                          <FaChevronUp />
                        </>
                      ) : (
                        <>
                          <span>عرض البلوكات ({bookLesson.blocks?.length ?? 0})</span>
                          <FaChevronDown />
                        </>
                      )}
                    </button>
                  </div>

                  <div className={styles.lessonInfoGrid}>
                    <div className={styles.infoItem}>
                      <FaBook className={styles.infoIcon} />
                      <span className={styles.infoLabel}>الكتاب</span>
                      <span className={styles.infoValue}>{bookLesson.book_title}</span>
                    </div>

                    <div className={styles.infoItem}>
                      <FaBookmark className={styles.infoIcon} />
                      <span className={styles.infoLabel}>الجزء</span>
                      <span className={styles.infoValue}>
                        {bookLesson.part_title} (من {bookLesson.part_start_page} → {bookLesson.part_end_page})
                      </span>
                    </div>

                    <div className={styles.infoItem}>
                      <FaFileAlt className={styles.infoIcon} />
                      <span className={styles.infoLabel}>الصفحات</span>
                      <span className={styles.infoValue}>
                        من {bookLesson.start_page} → {bookLesson.end_page}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedLessons[bookLesson.id] && (
                  <div className={styles.blocksContainer}>
                    {bookLesson.blocks?.length > 0 ? (
                      bookLesson.blocks.map((block) => (
                        <div key={block.id}>
                          <BlockCard
                            block={block}
                            lessonId={bookLesson.id}
                            IsManager={false}
                          />
                        </div>
                      ))
                    ) : (
                      <p className={styles.noBlocks}>لا توجد كتل تعليمية</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noData}>لا توجد دروس في الكتاب</div>
          )}
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.lessonHeader}>
            <h2 className={styles.sectionTitle}>
              محتوى الدرس ({lessonIndex.lesson?.lesson_block?.length ?? 0})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={styles.toggleButton}
                onClick={() => toggleAllLessons(true)}
                disabled={!lessonIndex.lesson?.lesson_block?.length}
              >
                <span>توسيع الكل</span>
                <FaChevronDown />
              </button>
              <button
                className={styles.toggleButton}
                onClick={() => toggleAllLessons(false)}
                disabled={!lessonIndex.lesson?.lesson_block?.length}
              >
                <span>طي الكل</span>
                <FaChevronUp />
              </button>
            </div>
          </div>

          {lessonIndex.lesson?.lesson_block?.length > 0 ? (
            lessonIndex.lesson.lesson_block.map((lessonBlock) => (
              <div key={lessonBlock.id} className={styles.lessonBlock}>
                <div className={styles.lessonDetails}>
                  <div className={styles.lessonHeader}>
                    <h3 className={styles.lessonTitle}>{lessonBlock.title}</h3>
                    <button
                      className={styles.toggleButton}
                      onClick={() => toggleLessonBlocks(lessonBlock.id)}
                    >
                      {expandedLessons[lessonBlock.id] ? (
                        <>
                          <span>إخفاء التفاصيل</span>
                          <FaChevronUp />
                        </>
                      ) : (
                        <>
                          <span>عرض التفاصيل</span>
                          <FaChevronDown />
                        </>
                      )}
                    </button>
                  </div>

                  {lessonBlock.image && renderImage(lessonBlock.image, lessonBlock.title)}

                  <div className={styles.blockContent}>
                    <p>{lessonBlock.content}</p>
                  </div>

                  <div className={styles.lessonInfoGrid}>
                    <div className={styles.infoItem}>
                      <FaList className={styles.infoIcon} />
                      <span className={styles.infoLabel}>الترتيب</span>
                      <span className={styles.infoValue}>#{lessonBlock.order}</span>
                    </div>

                    <div className={styles.infoItem}>
                      <FaCube className={styles.infoIcon} />
                      <span className={styles.infoLabel}>النوع</span>
                      <span className={styles.infoValue}>{lessonBlock.block_type}</span>
                    </div>

                    {lessonBlock.image && (
                      <div className={styles.infoItem}>
                        <FaImage className={styles.infoIcon} />
                        <span className={styles.infoLabel}>تحتوي على صورة</span>
                        <span className={styles.infoValue}>نعم</span>
                      </div>
                    )}

                    {lessonBlock.linked_blocks?.length > 0 && (
                      <div className={styles.infoItem}>
                        <FaBookmark className={styles.infoIcon} />
                        <span className={styles.infoLabel}>البلوكات المرتبطة</span>
                        <span className={styles.infoValue}>{lessonBlock.linked_blocks.length}</span>
                      </div>
                    )}

                    {lessonBlock.cards?.length > 0 && (
                      <div className={styles.infoItem}>
                        <FaIdCard className={styles.infoIcon} />
                        <span className={styles.infoLabel}>البطاقات</span>
                        <span className={styles.infoValue}>{lessonBlock.cards.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {expandedLessons[lessonBlock.id] && (
                  <div className={styles.blockDetails}>
                    {/* الأهداف التعليمية */}
                    {lessonBlock.course_block_objective?.length > 0 && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FaBullseye className={styles.detailIcon} />
                          الأهداف التعليمية ({lessonBlock.course_block_objective.length})
                        </h4>
                        <div className={styles.objectivesList}>
                          {lessonBlock.course_block_objective.map((objective) => (
                            <div key={objective.id} className={styles.objectiveItem}>
                              <div className={styles.objectiveHeader}>
                                <strong>{objective.title}</strong>
                              </div>
                              <div className={styles.objectiveDescription}>
                                {objective.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* التمارين */}
                    {lessonBlock.course_block_exercises?.length > 0 && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FaQuestionCircle className={styles.detailIcon} />
                          التمارين ({lessonBlock.course_block_exercises.length})
                        </h4>
                        <div className={styles.exercisesList}>
                          {lessonBlock.course_block_exercises.map((exercise) => (
                            <div key={exercise.id} className={styles.exerciseItem}>
                              <div className={styles.exerciseQuestion}>
                                <strong>السؤال:</strong> {exercise.question_text}
                              </div>
                              <div className={styles.exerciseDetails}>
                                <span className={styles.exerciseType}>
                                  <strong>النوع:</strong> {exercise.question_type}
                                </span>
                                {exercise.correct_answer && (
                                  <span className={styles.exerciseAnswer}>
                                    <strong>الإجابة:</strong> {exercise.correct_answer}
                                  </span>
                                )}
                                {exercise.explanation && (
                                  <span className={styles.exerciseExplanation}>
                                    <strong>التفسير:</strong> {exercise.explanation}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الريل التعليمي */}
                    {lessonBlock.course_block_reel && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FaPlayCircle className={styles.detailIcon} />
                          الريل التعليمي
                        </h4>
                        <div className={styles.reelItem}>
                          <div className={styles.reelField}>
                            <strong>نص البداية:</strong> {lessonBlock.course_block_reel.hook_text}
                          </div>
                          <div className={styles.reelField}>
                            <strong>ملخص المحتوى:</strong> {lessonBlock.course_block_reel.body_summary}
                          </div>
                          <div className={styles.reelField}>
                            <strong>النبرة:</strong> {lessonBlock.course_block_reel.tone}
                          </div>
                          <div className={styles.reelField}>
                            <strong>التلميح البصري:</strong> {lessonBlock.course_block_reel.visual_hint}
                          </div>
                          {lessonBlock.course_block_reel.question_text && (
                            <div className={styles.reelField}>
                              <strong>سؤال الختام:</strong> {lessonBlock.course_block_reel.question_text}
                            </div>
                          )}
                          {lessonBlock.course_block_reel.outro_question && (
                            <div className={styles.reelField}>
                              <strong>سؤال النهاية:</strong> {lessonBlock.course_block_reel.outro_question}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* البطاقات */}
                    {lessonBlock.cards?.length > 0 && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FaIdCard className={styles.detailIcon} />
                          البطاقات ({lessonBlock.cards.length})
                        </h4>
                        <div className={styles.flashCardsContainer}>
                          {lessonBlock.cards.map((card) => (
                            <FlashCardItem key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* البلوكات المرتبطة */}
                    {lessonBlock.linked_blocks?.length > 0 && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <FaBookmark className={styles.detailIcon} />
                          البلوكات المرتبطة ({lessonBlock.linked_blocks.length})
                        </h4>
                        <div className={styles.blocksContainer}>
                          {lessonBlock.linked_blocks.map((linkedBlock) => (
                            <div key={linkedBlock.id} className={styles.linkedBlock}>
                              <BlockCard
                                block={linkedBlock}
                                lessonId={linkedBlock.lesson}
                                IsManager={false}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noData}>
              لا يوجد محتوى تعليمي لهذا الدرس
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;