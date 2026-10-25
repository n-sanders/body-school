import { useState } from "react";
import { Link, useParams } from "react-router";
import { LessonReading } from "../components/LessonReading";
import { content, getItem, getLesson } from "../content/loader";
import { useProgress } from "../hooks/useProgress";
import { ItemCard } from "../components/ItemCard";
import { CompareItems } from "../components/CompareItems";
import { ItemImage } from "../components/ItemImage";
import { LessonQuiz } from "../components/LessonQuiz";
import { LessonStatusToggle } from "../components/LessonStatusToggle";
import { StatusBadge } from "../components/StatusBadge";
import type { Lesson } from "../content/schema";
import { lessonStatus, unfinishedLessonActivities } from "../lib/progress";
import { noun } from "../lib/site";
import { NotFoundPage } from "./NotFoundPage";

export function LessonPage() {
  const { lessonId = "" } = useParams();
  const lesson = getLesson(lessonId);
  if (!lesson) return <NotFoundPage />;
  return <LessonView key={lesson.id} lesson={lesson} />;
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const { progress } = useProgress();
  const [quizRun, setQuizRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const unit = content.unitOf.get(lesson.id)!;
  const status = lessonStatus(progress, lesson);
  const record = progress.lessons[lesson.id];
  const index = content.lessonOrder.indexOf(lesson.id);
  const prevId = content.lessonOrder[index - 1];
  const nextId = content.lessonOrder[index + 1];
  const missing = lesson.prerequisites.filter((p) => !progress.lessons[p]?.completed);
  const unfinishedActivities = unfinishedLessonActivities(progress, lesson.body);
  const quizLocked = status === "locked" || unfinishedActivities.length > 0;

  return (
    <article className="lesson">
      <p className="breadcrumb">
        <Link to="/learn">Learn</Link> / {unit.title}
      </p>
      <header className="lesson-header">
        <div>
          <h1>{lesson.title}</h1>
          <p className="lead">{lesson.summary}</p>
          <p className="muted small">About 10 minutes · read, explore an example, and answer five concept questions.</p>
        </div>
        <div className="lesson-status">
          <StatusBadge status={status} record={record} />
          {record?.bestScore != null && (
            <span className="muted small">Best quiz score: {Math.round(record.bestScore * 100)}%</span>
          )}
          <LessonStatusToggle lesson={lesson} />
        </div>
      </header>

      {status === "locked" && (
        <div className="banner warning">
          This lesson is locked. Finish{" "}
          {missing.map((id, i) => (
            <span key={id}>
              {i > 0 && ", "}
              <Link to={`/lesson/${id}`}>{getLesson(id)!.title}</Link>
            </span>
          ))}{" "}
          first. You can still read it, or use <em>Mark completed</em> on those lessons if you already did them.
        </div>
      )}

      <section className="card">
        <h2>In this lesson you will</h2>
        <ul>
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <LessonReading body={lesson.body} />

      {lesson.images.length > 0 && (
        <section>
          <h2>Example images</h2>
          <div className="gallery captioned">
            {lesson.images.map((img) => (
              <div key={img.url} className="captioned-image">
                <ItemImage src={img.url} alt={img.item ? `${getItem(img.item)!.name}: ${img.caption}` : img.caption} />
                <p>{img.caption}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(lesson.items.length > 0 || lesson.compare.length > 0) && (
        <section className="deeper-exploration card" aria-labelledby="go-deeper-heading">
          <h2 id="go-deeper-heading">Go deeper: explore the structures</h2>
          <p>Read these examples as part of the lesson. Use the pictures and facts to connect each structure with its job.</p>
      {lesson.items.length > 0 && (
        <section>
          <h3>{noun.Many} in this lesson</h3>
          {lesson.items.map((slug) => (
            <ItemCard key={slug} item={getItem(slug)!} />
          ))}
        </section>
      )}

      {lesson.compare.map(([a, b]) => (
        <CompareItems key={`${a}-${b}`} a={getItem(a)!} b={getItem(b)!} />
      ))}
        </section>
      )}

      {lesson.sources.length > 0 && (
        <section className="sources muted small">
          Sources:{" "}
          {lesson.sources.map((s, i) => (
            <span key={s.id}>
              {i > 0 && "; "}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </span>
          ))}
        </section>
      )}

      <section className="quiz-section">
        <h2>Lesson quiz</h2>
        {quizOpen ? (
          <LessonQuiz key={quizRun} lesson={lesson} onClose={() => setQuizOpen(false)} />
        ) : (
          <div className="card">
            <p>
              {lesson.quiz.length} questions. Score {Math.round(lesson.passMark * 100)}% or more to complete the
              lesson.
            </p>
            <button
              className="btn primary"
              disabled={quizLocked}
              aria-describedby={quizLocked ? "quiz-unlock-instructions" : undefined}
              onClick={() => {
                setQuizRun((n) => n + 1);
                setQuizOpen(true);
              }}
            >
              {record?.attempts ? "Retake quiz" : "Start quiz"}
            </button>
            {quizLocked && (
              <div id="quiz-unlock-instructions" className="muted small" aria-live="polite">
                {status === "locked" && <p>Finish the earlier lessons to unlock the quiz.</p>}
                {unfinishedActivities.length > 0 && (
                  <>
                    <p>Complete these activities to unlock the quiz:</p>
                    <ul>
                      {unfinishedActivities.map((id) => <li key={id}>{content.activities.get(id)?.title ?? id}</li>)}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <nav className="lesson-nav" aria-label="Lesson navigation">
        {prevId ? <Link to={`/lesson/${prevId}`}>← {getLesson(prevId)!.title}</Link> : <span />}
        {nextId && <Link to={`/lesson/${nextId}`}>{getLesson(nextId)!.title} →</Link>}
      </nav>
    </article>
  );
}
