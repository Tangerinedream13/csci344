class Person: 
    def__init__(self, name, age):
        self.name = name
        self.age = age
    def sayGreeting(self):
        print(self.name, 'says hello')
person1 = Person('Shirly', 67)
person2 = Person('Walter', 67)
person1.sayGreeting()
person2.sayGreeting()
