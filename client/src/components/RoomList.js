import styled from 'styled-components';

const RoomList = () => {
    const roomId = 'ABC123';
    const roomTitle = "MisterAzix's room";
    const roomSlot = 0;

    return (
        <List>
            <Item id={roomId}><span>{roomTitle}</span><span>{roomSlot}/2</span></Item>
            <Item id={roomId}><span>{roomTitle}</span><span>{roomSlot}/2</span></Item>
            <Item id={roomId}><span>{roomTitle}</span><span>{roomSlot}/2</span></Item>
        </List>
    );
}

export default RoomList;


const List = styled.ul`
    list-style: none;
    max-height: 50vmin;
    overflow-y: scroll;
    overflow-x: visible;
`;

const Item = styled.li`
    width: 50vmin;
    padding: 1.5vmin 2vmin;
    margin: 2.5vmin;
    border: none;
    outline: none;
    border-radius: 1.5vmin;
    background: var(--background-color);
    box-shadow: var(--box-shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    span {
        font-size: 2vmin;
        font-weight: bold;
    }
`;