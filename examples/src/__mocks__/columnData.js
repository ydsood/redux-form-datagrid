const data = [
  // missing workphone should be rendered as blank
  {
    name: 'John Doe',
    govtID: '823456789',
    homePhone: '3431231233',
    workPhone: '',
    insuredDate: '09/10/2020',
    amount: '1875.00',
  },
  // incorrect data in govtID should be rendered with error
  {
    name: 'John Smith',
    govtID: '72345670',
    homePhone: '3431231237',
    workPhone: '',
    insuredDate: '02/13/2020',
    amount: '1250.00',
  },
  {
    name: 'Darius Carreira',
    govtID: '223456678',
    homePhone: '8674561293',
    workPhone: '8674561245',
    insuredDate: '07/25/2020',
    amount: '150.00',
  },
  {
    name: 'John Smith',
    govtID: '12345678',
    homePhone: '3431231236',
    workPhone: '',
    insuredDate: '01/13/2020',
    amount: '11625.00',
  },
  {
    name: 'Darius Carreira',
    govtID: '523456678',
    homePhone: '8674561297',
    workPhone: '8674561245',
    insuredDate: '03/11/2020',
    amount: '1152.29'
  },
  {
    name: 'John Smith',
    govtID: '32345678',
    homePhone: '3431231234',
    workPhone: '',
    insuredDate: '06/22/2020',
    amount: '-1250'
  },
  {
    name: 'Darius Carreira1',
    govtID: '923456678',
    homePhone: '8674561294',
    workPhone: '8674561245',
    insuredDate: '04/28/2020',
    amount:'1875.00'
  },
  {
    name: 'John Smith1',
    govtID: '42345678',
    homePhone: '3431231234',
    workPhone: '',
    insuredDate: '08/15/2020',
    amount: '1050'
  },
  {
    name: 'Darius Carreira1',
    govtID: '223456678',
    homePhone: '8674561292',
    workPhone: '8674561245',
    insuredDate: '05/19/2020',
    amount: '1050.00'
  },
  {
    name: 'John Smith',
    govtID: '62345678',
    homePhone: '3431231234',
    workPhone: '',
    insuredDate: '09/14/2020',
    amount: '69.95'
  },
  {
    name: 'Darius Carreira1',
    govtID: '823456678',
    homePhone: '8674561294',
    workPhone: '8674561245',
    insuredDate: '03/20/2020',
    amount: '65'
  },
  {
    name: 'John Smith1',
    govtID: '72345678',
    homePhone: '3431231234',
    workPhone: '',
    insuredDate: '12/12/2020',
    amount: '34.97'
  },
  {
    name: 'Darius Carreira1',
    govtID: '323456678',
    homePhone: '8674561292',
    workPhone: '8674561245',
    insuredDate: '11/12/2020',
    amount:'34.97'
  },
  {
    name: 'John Smith',
    govtID: '62345678',
    homePhone: '3431231234',
    workPhone: '',
    insuredDate: '05/30/2020',
    amount:'34.97'
  },
  {
    name: 'Darius Carreira1',
    govtID: '123456678',
    homePhone: '8674561294',
    workPhone: '8674561245',
    insuredDate: '09/29/2020',
    amount:'34.97'
  }
];

export default data;
