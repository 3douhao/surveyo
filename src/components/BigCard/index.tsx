import React, {useState} from 'react';
import {Card, Avatar, Select, Button} from 'antd';
import update from 'immutability-helper';
import {gql, useMutation} from '@apollo/client';
import {
  BorderInnerOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import header from '../../images/banner4.jpg';

import TextQuestionCard from '../TextQuestionCard';
import MCQCard from '../MCQCard';
import DropDown from '../DropDown';
const {Meta} = Card;

// type BigCardState = {children: []}
type question = any;

function BigCard() {
  const [questions, setQuestions] = useState<question>([]);
  const [questionCard, setQuestionCard] = useState('Text');

  const getCard = (i: number) => {
    const question = questions[i];
    const params = {
      question: question,
      updateQuestion: (question: question) =>
        setQuestions(update(questions, {$splice: [[i, 1, question]]})),
      deleteQuestion: () =>
        setQuestions(update(questions, {$splice: [[i, 1]]})),
    };
    switch (question.type) {
      case 'SingleChoice':
        return <MCQCard {...params} />;
      default:
        return <TextQuestionCard {...params} />;
    }
  };

  const CREATE_FORM = gql`
    mutation($form: AddFormInput!) {
      addForm(input: [$form]) {
        form {
          id
        }
      }
    }
  `;

  const [sendToClient, {loading}] = useMutation(CREATE_FORM, {
    variables: {questions},
  });

  const sendState = () => {
    for (let index = 0; index < questions.length; index++) {
      if ('options' in questions[index]) {
        let newOptions = questions[index].options.map(
          (value: any, index: any) => {
            return {order: index, title: value};
          }
        );
        questions[index].options = newOptions;
      }
    }
    console.log(questions);
    sendToClient();
  };

  return (
    <div>
      <Card
        cover={<img alt="example" src={header} />}
        actions={[
          <DropDown changeCardType={setQuestionCard} />,
          <BorderInnerOutlined
            key="edit"
            onClick={() => setQuestions(questions.concat({type: questionCard}))}
          />,
          <Button onClick={() => sendState()}> Create Form</Button>,
        ]}
      >
        <Meta
          title="Surveyo"
          description="Simple App that let's you create simple surveys"
        />
        <br />
        <br />

        {questions.map((question: question, index: number) => (
          <div key={index}>
            <Card>{getCard(index)}</Card>
            <br />
            <br />
          </div>
        ))}
        <br />
        <br />
      </Card>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default BigCard;
