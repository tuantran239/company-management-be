
export const convertUrlToSubject = (url: string) => {
  const subjectParam = url.split('/')[2];

  let subject = subjectParam.split('?')[0];

  subject = subject.split('-').join('_');

  return subject;
};
