const data = [
  // missing workphone should be rendered as blank
  {
    name: 'John Doe',
    govtID: '123456789',
    homePhone: '3431231234'
  },
  // incorrect data in govtID should be rendered with error
  {
    name: 'John Smith',
    govtID: '12345678',
    homePhone: '3431231234',
    workPhone: ''
  },
  {
    name: 'Darius Carreira',
    govtID: '123456678',
    homePhone: '8674561298',
    workPhone: '8674561245'
  },
  {
    name: 'John Smith',
    govtID: '12345678',
    homePhone: '3431231234',
    workPhone: ''
  },
  {
    name: 'Darius Carreira',
    govtID: '123456678',
    homePhone: '8674561298',
    workPhone: '8674561245'
  },
  {
    name: 'John Smith',
    govtID: '12345678',
    homePhone: '3431231234',
    workPhone: ''
  },
  {
    name: 'Darius Carreira1',
    govtID: '123456678',
    homePhone: '8674561298',
    workPhone: '8674561245'
  },
  {
    name: 'John Smith1',
    govtID: '12345678',
    homePhone: '3431231234',
    workPhone: ''
  },
  {
    name: 'Darius Carreira1',
    govtID: '123456678',
    homePhone: '8674561298',
    workPhone: '8674561245'
  }
];

export default data;
