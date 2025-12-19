import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Spin, Card, Button, Text, RadioGroup } from '@gravity-ui/uikit';
import type { RadioGroupOption } from '@gravity-ui/uikit';
import { useTestStore } from '../../storage/testStorage';
import type { TestAnswerDto } from '../../api/types/openapi';
import styles from './TestPage.module.scss';

const TestPage = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const attemptIdNum = attemptId ? parseInt(attemptId, 10) : undefined;

  const { currentTest, testResult, loading, error, fetchTestQuestions, submitTest } = useTestStore();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (attemptIdNum) {
      fetchTestQuestions(attemptIdNum);
    }
  }, [attemptIdNum, fetchTestQuestions]);

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!attemptIdNum || !currentTest) {
      return;
    }

    // Convert answers to required format
    const answersArray: TestAnswerDto[] = currentTest.questions.map(q => ({
      question_id: q.question_id,
      selected_option_id: answers[q.question_id] || q.options[0].option_id,
    }));

    try {
      await submitTest(attemptIdNum, answersArray);
    } catch (err) {
      console.error('Failed to submit test:', err);
    }
  };

  const handleBackToDirections = () => {
    navigate('/candidate');
  };

  // Show result screen if test is submitted
  if (testResult) {
    const percentage = testResult.max_score > 0
      ? Math.round((testResult.score / testResult.max_score) * 100)
      : 0;

    return (
      <div className={styles.page}>
        <Card className={styles.resultCard}>
          <Text variant="display-2" className={styles.title}>Тест завершен!</Text>

          <div className={styles.resultSection}>
            <div className={styles.scoreDisplay}>
              <Text variant="display-3" className={styles.score}>
                {testResult.score} / {testResult.max_score}
              </Text>
              <Text variant="header-1" className={styles.percentage}>
                {percentage}%
              </Text>
            </div>

            <div className={styles.resultDetails}>
              <div className={styles.detailItem}>
                <Text variant="subheader-1" color="secondary">Статус</Text>
                <Text variant="body-2">{testResult.status}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="subheader-1" color="secondary">Завершено</Text>
                <Text variant="body-2">
                  {new Date(testResult.finished_at).toLocaleString('ru-RU')}
                </Text>
              </div>
            </div>
          </div>

          <Button size="l" view="action" onClick={handleBackToDirections}>
            Вернуться к направлениям
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Spin size="l" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Card>
          <Text variant="body-1" color="danger">Ошибка: {error}</Text>
          <Button size="l" view="normal" onClick={handleBackToDirections} className={styles.backButton}>
            Вернуться к направлениям
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className={styles.page}>
        <Card>
          <Text variant="body-1">Тест не найден</Text>
          <Button size="l" view="normal" onClick={handleBackToDirections} className={styles.backButton}>
            Вернуться к направлениям
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate how many questions are answered
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentTest.questions.length;
  const allAnswered = answeredCount === totalQuestions;

  // Sort questions by order_index
  const sortedQuestions = [...currentTest.questions].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text variant="display-2">Тест #{currentTest.test_id}</Text>
        <Text variant="body-1" color="secondary">
          Отвечено: {answeredCount} из {totalQuestions}
        </Text>
      </div>

      <div className={styles.questionsContainer}>
        {sortedQuestions.map((question, index) => {
          const selectedOptionId = answers[question.question_id];

          return (
            <Card key={question.question_id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <Text variant="header-2">
                  Вопрос {index + 1}
                </Text>
                <Text variant="body-1" color="secondary" className={styles.points}>
                  {question.difficulty} {question.difficulty === 1 ? 'балл' : 'баллов'}
                </Text>
              </div>

              <Text variant="body-1" className={styles.questionText}>
                {question.text}
              </Text>

              <div className={styles.options}>
                <RadioGroup
                  size="l"
                  value={selectedOptionId?.toString()}
                  onUpdate={(value) => handleAnswerChange(question.question_id, parseInt(value, 10))}
                  options={question.options.map(option => ({
                    value: option.option_id.toString(),
                    content: option.text,
                  }))}
                  direction="vertical"
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className={styles.submitSection}>
        {!allAnswered && (
          <Text variant="body-1" color="warning" className={styles.warning}>
            Ответьте на все вопросы перед отправкой
          </Text>
        )}
        <Button
          size="xl"
          view="action"
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          loading={loading}
        >
          Отправить ответы
        </Button>
      </div>
    </div>
  );
};

export default TestPage;
