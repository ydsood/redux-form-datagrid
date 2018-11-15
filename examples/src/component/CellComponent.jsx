import React, {Component} from 'react';
import {Accordion, Icon,Grid,Label,Checkbox} from 'semantic-ui-react';

type CellProps = {
  name: string,
  govtID:string,
  homePhone:string,
  workPhone:string,
}; 

class CellComponent extends Component<CellProps>{
  constructor(props){
    super(props);
    this.state = {
      activeIndex :-1
    }
  }

  handleClick = (e,titleProps) =>{
    const {index} = titleProps;
    const {activeIndex} = this.state;
    const newIndex = activeIndex === index ? -1:index;
    this.setState({activeIndex:newIndex});
  }

  render(){
    const { name, govtID, homePhone, workPhone} = this.props;
    const {activeIndex} = this.state;
    return(
      <Accordion>
        <Accordion.Title index={0} onClick={this.handleClick} active={activeIndex === 0}>
          <Icon name='dropdown' />
          {name}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
              <Label color='red' horizontal>
                Gov ID
              </Label>
              {govtID}
              </Grid.Column>
              <Grid.Column>
              <Label color='purple' horizontal>
                Home Phone
              </Label>
              {homePhone}
              </Grid.Column>
              <Grid.Column>
                <Checkbox label={workPhone} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Accordion>

    )
  }
}
export default CellComponent;
