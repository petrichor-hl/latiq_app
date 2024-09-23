import React, { useEffect } from 'react';
import { Appearance, Button, Text, View } from 'react-native';

function App(): React.JSX.Element {
  useEffect(() => Appearance.setColorScheme('light'), []);

  const callApi = () => {
    const fetchPokemonData = async () => {
      try {
        await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPokemonData();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App Screen</Text>
      <Button onPress={callApi} title="Test Call API" />
    </View>
  );
}

export default App;
